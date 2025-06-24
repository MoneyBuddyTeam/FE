import { axiosInstance } from '../api';
import { API_ENDPOINTS } from '../../config/api';

// 북마크 목록 조회
export const getBookmarksApi = async () => {
  console.log('🔖 API 호출: 북마크 목록 조회');
  const response = await axiosInstance.get('/api/v1/bookmarks');
  console.log('✅ API 응답: 북마크 목록 조회 성공');
  return response.data;
};

// 북마크 토글
export const toggleBookmarkApi = async (expertId: number) => {
  console.log(`🔖 API 호출: 북마크 토글 - 전문가 ID: ${expertId}`);
  const response = await axiosInstance.post(
    `/api/v1/bookmarks/toggle/${expertId}`,
  );
  console.log('✅ API 응답: 북마크 토글 성공');
  return response.data;
};

// 북마크 제거
export const removeBookmarkApi = async (expertId: number) => {
  console.log(`🗑️ API 호출: 북마크 제거 - 전문가 ID: ${expertId}`);
  // 북마크 제거도 toggle API를 사용
  return toggleBookmarkApi(expertId);
};
