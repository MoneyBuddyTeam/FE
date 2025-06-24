import { axiosInstance } from '../api';
import { API_ENDPOINTS } from '../../config/api';

// 탈퇴를 위한 비밀번호 확인 API
export const verifyPasswordForWithdraw = async (
  password: string,
): Promise<void> => {
  console.log('🔒 탈퇴 비밀번호 확인 API 호출');
  const response = await axiosInstance.post(
    API_ENDPOINTS.verifyPasswordWithdraw,
    {
      password,
    },
  );
  console.log('✅ 탈퇴 비밀번호 확인 성공');
  return response.data;
};

// 회원탈퇴 API
export const withdrawUser = async (userId: number): Promise<void> => {
  console.log('🗑️ 회원탈퇴 API 호출');
  const response = await axiosInstance.delete(
    `${API_ENDPOINTS.deleteUser(userId)}`,
  );
  console.log('✅ 회원탈퇴 성공');
  return response.data;
};
