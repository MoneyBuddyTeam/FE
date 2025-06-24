import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/useAuthStore';
import { API_BASE_URL, MSW_CONFIG, API_CONFIG } from '../config/api';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.timeout,
  withCredentials: true, // 쿠키 기반 인증을 위해 추가
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 외부 API 호출 방지 검증
    if (
      config.url &&
      !config.url.startsWith('/api/v1/') &&
      !config.url.startsWith('http://localhost') &&
      !config.url.startsWith('https://api.moneybuddy.com')
    ) {
      console.error('🚨 외부 API 호출이 차단되었습니다:', config.url);
      throw new Error(`외부 API 호출이 허용되지 않습니다: ${config.url}`);
    }

    // MSW 디버깅이 활성화된 경우에만 로깅
    if (MSW_CONFIG.debug && MSW_CONFIG.logRequests) {
      console.log('🔍 API 요청:', {
        method: config.method?.toUpperCase(),
        url: `${config.baseURL}${config.url}`,
        data: config.data,
        params: config.params,
        headers: config.headers,
      });
    }

    // 인증 토큰 추가
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // MSW 환경에서 baseURL 확인
    if (
      MSW_CONFIG.enabled &&
      config.url &&
      !config.url.startsWith('/api/v1/')
    ) {
      console.warn(
        '⚠️ MSW: API 경로가 /api/v1/로 시작하지 않습니다:',
        config.url,
      );
    }

    return config;
  },
  error => {
    console.error('❌ 요청 인터셉터 오류:', error);
    return Promise.reject(error);
  },
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  response => {
    if (MSW_CONFIG.debug && MSW_CONFIG.logResponses) {
      console.log('✅ API 응답:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  error => {
    if (MSW_CONFIG.debug) {
      console.error('❌ API 에러:', {
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data,
        message: error.message,
      });
    }

    // MSW 환경에서 북마크 API 오류처리
    if (
      MSW_CONFIG.enabled &&
      error.config?.url &&
      (error.config.url.includes('/bookmark') ||
        (error.config.url.includes('advisors') &&
          error.config.url.includes('bookmark'))) &&
      error.response?.status === 500
    ) {
      console.warn('⚠️ MSW: 북마크 API 오류 감지, 기본 응답 반환');
      return Promise.resolve({
        data: { bookmarked: true, message: '북마크가 추가되었습니다.' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: error.config,
      });
    }

    // MSW 환경에서 외부 API 호출 감지
    if (
      MSW_CONFIG.enabled &&
      error.config?.url &&
      error.response?.status === 500
    ) {
      const isExternalAPI =
        error.config.url.includes('apis.data.go.kr') ||
        !error.config.url.startsWith('/api/v1/');
      if (isExternalAPI) {
        console.error(
          '🚨 MSW: 외부 API 호출이 감지되었습니다. 내부 API 경로를 확인하세요:',
          error.config.url,
        );
      }
    }

    // 401 에러 처리 (토큰 만료) - MSW 모드가 아닐 때만 실행
    if (error.response?.status === 401 && !MSW_CONFIG.enabled) {
      console.log('🔄 토큰 만료로 인한 토큰 재발급 시도');
      // 토큰 재발급 시도 (쿠키 기반)
      return axiosInstance
        .post('/api/v1/auth/refresh', null, {
          withCredentials: true,
          headers: { Authorization: undefined },
        })
        .then(() => {
          // 토큰 재발급 성공 시 원래 요청 재시도
          return axiosInstance.request(error.config);
        })
        .catch(() => {
          // 토큰 재발급 실패 시 로그아웃 처리
          useAuthStore.getState().clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        });
    }

    // 에러 형식 정규화 (명세서에 따라 텍스트 또는 JSON 처리)
    if (error.response?.data) {
      // 텍스트 응답인 경우 그대로 사용
      if (typeof error.response.data === 'string') {
        error.message = error.response.data;
      }
      // JSON 응답인 경우 message 필드 추출
      else if (error.response.data.message) {
        error.message = error.response.data.message;
      }
    }

    return Promise.reject(error);
  },
);
