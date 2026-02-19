import { axiosInstance } from '../api';
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '../../types/auth';

// 비밀번호 변경 API
export const changePasswordApi = async ({
  currentPassword,
  newPassword,
}: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
  console.log('🔑 API 호출: 비밀번호 변경');

  try {
    // 비밀번호 변경 요청 (명세서: PUT /api/v1/users/password)
    const response = await axiosInstance.put('/api/v1/users/password', {
      currentPassword,
      newPassword,
    });

    console.log('✅ API 응답: 비밀번호 변경 성공');
    return response.data;
  } catch (error: any) {
    console.error('❌ 비밀번호 변경 실패:', error);

    // API 에러 응답에서 message를 추출
    const errorMessage = error.response?.data?.message || error.message;

    // 기존 비밀번호 오류인 경우 더 명확한 메시지로 변환
    if (
      errorMessage.includes('password') ||
      errorMessage.includes('비밀번호')
    ) {
      throw new Error('기존 비밀번호가 일치하지 않습니다.');
    }

    throw new Error('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
  }
};
