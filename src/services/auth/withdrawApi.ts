import { axiosInstance } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type { VerifyPasswordResponse } from '../../types/auth';

// 탈퇴를 위한 비밀번호 확인 API - 명세서: POST /api/v1/auth/verify-password-withdraw
export const verifyPasswordForWithdraw = async (
  password: string,
): Promise<VerifyPasswordResponse> => {
  console.log('🔒 탈퇴 비밀번호 확인 API 호출', { password });
  const response = await axiosInstance.post(
    API_ENDPOINTS.verifyPasswordWithdraw,
    {
      password,
    },
  );
  console.log('🔒 탈퇴 비밀번호 확인 API 응답:', response.data);
  return response.data;
};

// 회원탈퇴 API - 명세서: DELETE /api/v1/users/withdraw
export const withdrawUser = async (): Promise<void> => {
  console.log('🗑️ 회원탈퇴 API 호출');
  await axiosInstance.delete(API_ENDPOINTS.withdraw);
  console.log('✅ 회원탈퇴 성공');
};
