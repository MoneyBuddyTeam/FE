// src/services/auth/loginApi.ts
import { axiosInstance } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from '../../types/auth';

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  console.log('🔐 로그인 API 호출');
  const response = await axiosInstance.post(API_ENDPOINTS.login, data, {
    withCredentials: true, // 쿠키 활성화
  });
  console.log('✅ 로그인 성공');

  // 명세서에 따른 응답 처리: Map 형식 {token, email, nickname}
  return {
    accessToken: response.data.token,
    refreshToken: '', // 쿠키로 관리되므로 빈 문자열
    user: {
      id: 1, // MSW에서 고정값
      email: response.data.email,
      nickname: response.data.nickname,
      role: 'USER',
    },
  };
};

// 로그아웃 API (POST /api/v1/auth/logout)
export const logoutApi = async (): Promise<void> => {
  console.log('🚪 로그아웃 API 호출');
  await axiosInstance.post(API_ENDPOINTS.logout);
  console.log('✅ 로그아웃 성공');
};

// 소셜 로그인 API
export const socialLoginApi = async (
  provider: 'kakao' | 'google' | 'naver',
  authCode: string,
): Promise<LoginResponse> => {
  console.log(`🔐 ${provider} 소셜 로그인 API 호출`);
  const endpoint =
    provider === 'kakao'
      ? API_ENDPOINTS.kakaoLogin
      : provider === 'google'
        ? API_ENDPOINTS.googleLogin
        : API_ENDPOINTS.naverLogin;

  const response = await axiosInstance.post(endpoint, { authCode });
  console.log(`✅ ${provider} 소셜 로그인 성공`);
  return response.data;
};

// 소셜 로그인 URL 생성
export const getSocialLoginUrl = (
  provider: 'kakao' | 'google' | 'naver',
): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173';

  // MSW 모드일 때는 모의 URL 반환
  if (import.meta.env.VITE_USE_MSW === 'true') {
    return `${baseUrl}/auth/social/${provider}/mock`;
  }

  // 실제 소셜 로그인 URL
  return `${baseUrl}/api/v1/auth/${provider}`;
};

// OAuth2 소셜 연동 해제
export const unlinkSocial = async (): Promise<{ message: string }> => {
  console.log('🔗 소셜 연동 해제 API 호출');
  const response = await axiosInstance.delete(API_ENDPOINTS.unlinkSocial);
  console.log('✅ 소셜 연동 해제 성공');
  return response.data;
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
