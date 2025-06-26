import { axiosInstance } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type {
  User,
  UpdateUserRequest,
  UpdateUserResponse,
  PublicProfileResponse,
  RecoverAccountRequest,
  RecoverAccountResponse,
  VerifyPasswordRequest,
  VerifyPasswordResponse,
} from '../../types/auth';

// 현재 사용자 정보 조회 (GET /api/v1/users/me)
export const getCurrentUser = async (): Promise<User> => {
  console.log('👤 API 호출: 현재 사용자 정보 조회');
  const response = await axiosInstance.get(API_ENDPOINTS.userProfile);
  console.log('✅ API 응답: 현재 사용자 정보 조회 성공');
  return response.data;
};

// 사용자 정보 수정 (PUT /api/v1/users/{id})
export const updateUser = async (
  id: number,
  data: UpdateUserRequest,
): Promise<UpdateUserResponse> => {
  console.log(`👤 API 호출: 사용자 정보 수정 - ID: ${id}`);
  const response = await axiosInstance.put(API_ENDPOINTS.updateUser(id), data);
  console.log('✅ API 응답: 사용자 정보 수정 성공');
  return response.data;
};

// 사용자 정보 조회 (ID로) (GET /api/v1/users/{id})
export const getUserById = async (id: number): Promise<User> => {
  console.log(`👤 API 호출: 사용자 정보 조회 - ID: ${id}`);
  const response = await axiosInstance.get(API_ENDPOINTS.getUserById(id));
  console.log('✅ API 응답: 사용자 정보 조회 성공');
  return response.data;
};

// 공개 프로필 조회 (GET /api/v1/users/{id}/profile)
export const getPublicProfile = async (
  userId: number,
): Promise<PublicProfileResponse> => {
  console.log(`👤 API 호출: 공개 프로필 조회 - User ID: ${userId}`);
  const response = await axiosInstance.get(API_ENDPOINTS.publicProfile(userId));
  console.log('✅ API 응답: 공개 프로필 조회 성공');
  return response.data;
};

// 계정 복구 (POST /api/v1/users/recover)
export const recoverUserAccount = async (
  data: RecoverAccountRequest,
): Promise<RecoverAccountResponse> => {
  console.log('👤 API 호출: 계정 복구');
  const response = await axiosInstance.post(API_ENDPOINTS.recoverUser, data);
  console.log('✅ API 응답: 계정 복구 성공');
  return response.data;
};

// 사용자 설정 조회 (GET /api/v1/users/{user_id}/settings)
export const getUserSettings = async (userId: number) => {
  console.log(`⚙️ API 호출: 사용자 설정 조회 - User ID: ${userId}`);
  const response = await axiosInstance.get(API_ENDPOINTS.userSettings(userId));
  console.log('✅ API 응답: 사용자 설정 조회 성공');
  return response.data;
};

// 사용자 설정 수정 (PUT /api/v1/users/{user_id}/settings)
export const updateUserSettings = async (
  userId: number,
  settings: { notificationEnabled?: boolean; privacyLevel?: string },
) => {
  console.log(`⚙️ API 호출: 사용자 설정 수정 - User ID: ${userId}`);
  const response = await axiosInstance.put(
    API_ENDPOINTS.userSettings(userId),
    settings,
  );
  console.log('✅ API 응답: 사용자 설정 수정 성공');
  return response.data;
};

// 비밀번호 확인
export const verifyPassword = async (
  data: VerifyPasswordRequest,
): Promise<VerifyPasswordResponse> => {
  console.log('🔐 API 호출: 비밀번호 확인');
  const response = await axiosInstance.post(API_ENDPOINTS.verifyPassword, data);
  console.log('✅ API 응답: 비밀번호 확인 성공');
  return response.data;
};
