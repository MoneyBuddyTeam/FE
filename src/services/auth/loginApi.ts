// src/services/auth/loginApi.ts
import { axiosInstance } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from '../../types/auth';

// 일반 로그인
export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  console.log('🔐 로그인 API 호출');
  const response = await axiosInstance.post('/api/v1/auth/login', data);
  return response.data;
};

type SocialProvider = 'kakao' | 'google' | 'naver';

interface SocialLoginUrlResponse {
  url: string;
  state?: string;
}

// 소셜 로그인 URL 조회
export const getSocialLoginUrl = async (
  provider: SocialProvider,
): Promise<string> => {
  try {
    console.log(`🔗 ${provider} 로그인 URL 요청`);
    const response = await axiosInstance.get<SocialLoginUrlResponse>(
      `/api/v1/auth/social/${provider}/url`,
    );
    console.log(`✅ ${provider} 로그인 URL 수신:`, response.data.url);
    return response.data.url;
  } catch (error: any) {
    console.error(`❌ ${provider} 로그인 URL 조회 실패:`, error);
    throw new Error(`${provider} 로그인 URL을 가져오는데 실패했습니다.`);
  }
};

// 소셜 로그인 콜백 처리
export const handleSocialCallback = async (
  provider: SocialProvider,
  code: string,
  state?: string,
): Promise<LoginResponse> => {
  try {
    console.log(`🔐 ${provider} 콜백 처리 시작`);
    const response = await axiosInstance.post(
      `/api/v1/auth/social/${provider}/callback`,
      { code, state },
    );
    console.log(`✅ ${provider} 로그인 성공`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ ${provider} 콜백 처리 실패:`, error);
    if (error.response?.status === 401) {
      throw new Error('인증에 실패했습니다. 다시 시도해주세요.');
    }
    if (error.response?.status === 409) {
      throw new Error('이미 다른 방법으로 가입된 이메일입니다.');
    }
    throw new Error('소셜 로그인에 실패했습니다. 다시 시도해주세요.');
  }
};

// 로그아웃
export const logoutApi = async (): Promise<void> => {
  await axiosInstance.post('/api/v1/auth/logout');
};

// Access Token 재발급 API (POST /api/v1/auth/refresh)
export const refreshTokenApi = async (): Promise<RefreshTokenResponse> => {
  console.log('🔄 Access Token 재발급 API 호출');
  const response = await axiosInstance.post(
    API_ENDPOINTS.refresh,
    {},
    {
      withCredentials: true, // 쿠키의 refresh_token 사용
    },
  );
  console.log('✅ Access Token 재발급 성공');
  return response.data;
};

// 소셜 로그인 통합 처리
export const socialLoginApi = async (
  provider: SocialProvider,
  code: string,
  state?: string,
): Promise<LoginResponse> => {
  try {
    console.log(`🔐 ${provider} 로그인 시도`);
    const response = await axiosInstance.post(`/api/v1/auth/${provider}`, {
      code,
      state,
    });
    console.log(`✅ ${provider} 로그인 성공`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ ${provider} 로그인 실패:`, error);
    throw new Error('소셜 로그인에 실패했습니다. 다시 시도해주세요.');
  }
};

// OAuth2 소셜 연동 해제
export const unlinkSocial = async (): Promise<{ message: string }> => {
  console.log('🔗 소셜 연동 해제 API 호출');
  const response = await axiosInstance.delete(API_ENDPOINTS.unlinkSocial);
  console.log('✅ 소셜 연동 해제 성공');
  return response.data;
};
