// src/services/auth/findIdApi.ts
import { axiosInstance } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type { FindIdRequest, FindIdResponse } from '../../types/auth';

// 아이디 찾기 API - 명세서: POST /api/v1/auth/find-email
export const findIdApi = async (
  data: FindIdRequest,
): Promise<FindIdResponse> => {
  console.log('🔍 아이디 찾기 API 호출:', data);
  const response = await axiosInstance.post(API_ENDPOINTS.findId, data);
  console.log('✅ 아이디 찾기 응답:', response.data);
  return response.data;
};
