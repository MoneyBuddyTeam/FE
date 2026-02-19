// src/services/auth/resetPasswordApi.ts
import { axiosInstance } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type {
  RequestResetPasswordRequest,
  VerifyResetCodeRequest,
  ResetPasswordRequest,
} from '../../types/auth';

// 비밀번호 재설정 요청 - 명세서: POST /api/v1/auth/password-reset/request
export const requestResetPasswordApi = async (
  data: RequestResetPasswordRequest,
) => {
  console.log('🔑 비밀번호 재설정 요청', data);
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.requestResetPassword,
      data,
    );
    console.log('✅ 비밀번호 재설정 메일 전송 성공');
    return response.data;
  } catch (error) {
    console.error('❌ 비밀번호 재설정 요청 실패:', error);
    throw error;
  }
};

// 재설정 인증번호 확인 - 명세서: POST /api/v1/auth/password-reset/verify
export const verifyResetCodeApi = async (data: VerifyResetCodeRequest) => {
  console.log('🔑 비밀번호 재설정 인증번호 확인', data);
  const response = await axiosInstance.post(
    API_ENDPOINTS.verifyResetCode,
    data,
  );
  console.log('✅ 비밀번호 재설정 인증번호 확인 성공');
  return response.data;
};

// 새 비밀번호 설정 - 명세서: POST /api/v1/auth/password-reset/confirm
export const resetPasswordApi = async (data: ResetPasswordRequest) => {
  console.log('🔑 새 비밀번호 설정', { token: data.token });
  const response = await axiosInstance.post(API_ENDPOINTS.resetPassword, data);
  console.log('✅ 새 비밀번호 설정 성공');
  return response.data;
};
