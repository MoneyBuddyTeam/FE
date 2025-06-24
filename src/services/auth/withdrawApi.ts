import { axiosInstance } from '../api';

// 탈퇴를 위한 비밀번호 확인 API
export const verifyPasswordForWithdraw = async (
  password: string,
): Promise<void> => {
  console.log('🔒 탈퇴 비밀번호 확인 API 호출');
  const response = await axiosInstance.post(
    '/api/v1/auth/verify-password-withdraw',
    {
      password,
    },
  );
  return response.data;
};

// 회원탈퇴 API
export const withdrawUser = async (): Promise<void> => {
  console.log('🗑️ 회원탈퇴 API 호출');
  const response = await axiosInstance.delete('/api/v1/users/withdraw');
  console.log('✅ 회원탈퇴 성공');
  return response.data;
};
