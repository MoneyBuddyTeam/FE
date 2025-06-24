import { axiosInstance } from '../services/api';

// 비밀번호 확인 API
export const verifyPasswordForWithdraw = async (password: string) => {
  const response = await axiosInstance.post(
    '/api/v1/auth/verify-password-withdraw',
    {
      password,
    },
  );
  return response.data;
};

// 회원탈퇴 API
export const withdrawUser = async (userId: number) => {
  const response = await axiosInstance.delete(`/api/v1/users/${userId}`);
  return response.data;
};
