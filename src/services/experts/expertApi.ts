import { axiosInstance } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type {
  Expert,
  ExpertFilterParams,
  ExpertListResponse,
  CategoryResponse,
} from '../../types/expert';
import type { MonthlyExpert } from '../../types/api/expert/expert';

// 월간 전문가 조회
export const getMonthlyExperts = async (): Promise<MonthlyExpert[]> => {
  const response = await axiosInstance.get(API_ENDPOINTS.getMonthlyExperts);
  return response.data;
};

// 전문가 목록 조회
export const getExperts = async (
  params?: ExpertFilterParams,
): Promise<ExpertListResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.category_id)
    queryParams.append('category_id', params.category_id.toString());
  if (params?.is_online !== undefined)
    queryParams.append('is_online', params.is_online.toString());
  if (params?.sort) queryParams.append('sort', params.sort);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);

  const response = await axiosInstance.get(
    `${API_ENDPOINTS.advisors}?${queryParams.toString()}`,
  );
  return response.data;
};

// 전문가 상세 조회
export const getExpertById = async (id: number): Promise<Expert> => {
  console.log(`🔍 API 호출: 전문가 상세 조회 - ID: ${id}`);
  const response = await axiosInstance.get(`${API_ENDPOINTS.advisors}/${id}`);
  console.log(`✅ API 응답: 전문가 상세 조회 성공`);
  return response.data;
};

// 카테고리 목록 조회
export const getCategories = async (): Promise<CategoryResponse[]> => {
  const response = await axiosInstance.get(API_ENDPOINTS.categories);
  return response.data;
};

// 북마크 목록 조회
export const getBookmarks = async (): Promise<Expert[]> => {
  const response = await axiosInstance.get(API_ENDPOINTS.bookmarks);
  return response.data;
};

// 북마크 토글
export const toggleBookmark = async (
  expertId: number,
): Promise<{
  bookmarked: boolean;
  message: string;
}> => {
  console.log(`🔖 북마크 토글 API 호출 - 전문가 ID: ${expertId}`);
  const response = await axiosInstance.post(
    `${API_ENDPOINTS.bookmarks}/${expertId}`,
  );
  console.log(`✅ 북마크 토글 성공`);
  return response.data;
};
