// src/services/auth/resetPasswordApi.ts
import { axiosInstance } from '../api';
import type {
  RequestResetPasswordRequest,
  VerifyResetCodeRequest,
  ResetPasswordRequest,
} from '../../types/auth';

// 비밀번호 재설정 요청
export const requestResetPasswordApi = async (
  data: RequestResetPasswordRequest,
) => {
  console.log('🔑 비밀번호 재설정 요청', data);
  try {
    const response = await axiosInstance.post(
      '/api/v1/auth/password-reset/request',
      data,
    );
    console.log('✅ 비밀번호 재설정 메일 전송 성공');
    return response.data;
  } catch (error) {
    console.error('❌ 비밀번호 재설정 요청 실패:', error);
    throw error;
  }
};

// 재설정 인증번호 확인
export const verifyResetCodeApi = async (data: VerifyResetCodeRequest) => {
  console.log('🔑 비밀번호 재설정 인증번호 확인', data);
  const response = await axiosInstance.post(
    '/api/v1/auth/password-reset/verify',
    data,
  );
  console.log('✅ 비밀번호 재설정 인증번호 확인 성공');
  return response.data;
};

// 새 비밀번호 설정
export const resetPasswordApi = async (data: ResetPasswordRequest) => {
  console.log('🔑 새 비밀번호 설정', { token: data.token });
  const response = await axiosInstance.post(
    '/api/v1/auth/password-reset/confirm',
    data,
  );
  console.log('✅ 새 비밀번호 설정 성공');
  return response.data;
};

// 로그인 상태에서 비밀번호 변경
export const changePasswordApi = async (
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  await axiosInstance.put('/api/v1/users/password', {
    currentPassword,
    newPassword,
  });
};
