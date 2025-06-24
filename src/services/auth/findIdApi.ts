// src/services/auth/findIdApi.ts
import { axiosInstance } from '../api';
import type { FindIdRequest, FindIdResponse } from '../../types/auth';

// 아이디 찾기 API
export const findIdApi = async (
  data: FindIdRequest,
): Promise<FindIdResponse> => {
  console.log('🔍 아이디 찾기 API 호출:', data);
  const response = await axiosInstance.post('/api/v1/auth/find-id', data);
  console.log('✅ 아이디 찾기 응답:', response.data);
  return response.data;
};
