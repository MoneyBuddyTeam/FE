import { axiosInstance } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type { BookmarkToggleResponse } from '../../types/bookmark';
import type { Expert } from '../../types/expert';

// 북마크 목록 조회
export const getBookmarksApi = async (): Promise<Expert[]> => {
  console.log('🔖 API 호출: 북마크 목록 조회');
  const response = await axiosInstance.get(API_ENDPOINTS.bookmarks);
  console.log('✅ API 응답: 북마크 목록 조회 성공');
  return response.data;
};

// 북마크 토글
export const toggleBookmarkApi = async (
  expertId: number,
): Promise<BookmarkToggleResponse> => {
  console.log(`🔖 API 호출: 북마크 토글 - 전문가 ID: ${expertId}`);
  const response = await axiosInstance.post(API_ENDPOINTS.bookmarkToggle, {
    expertId: expertId,
  });
  console.log('✅ API 응답: 북마크 토글 성공');
  return response.data;
};

// 북마크 제거
export const removeBookmarkApi = async (
  expertId: number,
): Promise<BookmarkToggleResponse> => {
  console.log(`🗑️ API 호출: 북마크 제거 - 전문가 ID: ${expertId}`);
  // 북마크 제거도 toggle API를 사용
  return toggleBookmarkApi(expertId);
};
