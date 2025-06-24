import { axiosInstance } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '../../types/auth';

// 비밀번호 변경
export const changePasswordApi = async (
  data: ChangePasswordRequest,
): Promise<ChangePasswordResponse> => {
  console.log('🔑 API 호출: 비밀번호 변경');
  const response = await axiosInstance.patch(
    API_ENDPOINTS.changePassword,
    data,
  );
  console.log('✅ API 응답: 비밀번호 변경 성공');
  return response.data;
};

// OAuth2 소셜 연동 해제 (DELETE /api/v1/auth/unlink)
export const unlinkSocialAccount = async (): Promise<void> => {
  console.log('🔗 API 호출: 소셜 연동 해제');
  const response = await axiosInstance.delete(API_ENDPOINTS.unlinkSocial);
  console.log('✅ API 응답: 소셜 연동 해제 성공');
  return response.data;
};
// OAuth2 소셜 연동 해제 API (DELETE /api/v1/auth/unlink)
export const unlinkSocialApi = async (): Promise<void> => {
  console.log('🔗 소셜 연동 해제 API 호출');
  await axiosInstance.delete(API_ENDPOINTS.unlinkSocial);
  console.log('✅ 소셜 연동 해제 성공');
};
