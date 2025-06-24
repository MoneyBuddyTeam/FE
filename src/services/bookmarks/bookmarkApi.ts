import { axiosInstance } from '../api';
import { API_ENDPOINTS } from '../../config/api';

// 북마크 목록 조회 (프로젝트에서 사용하는 경로)
export const getBookmarksApi = async () => {
  console.log('🔖 API 호출: 북마크 목록 조회');
  const response = await axiosInstance.get(API_ENDPOINTS.bookmarks);
  console.log('✅ API 응답: 북마크 목록 조회 성공');
  return response.data;
};

// 북마크 추가/제거 토글 (프로젝트에서 사용하는 경로)
export const toggleBookmarkApi = async (advisorId: number) => {
  console.log(`🔖 API 호출: 북마크 토글 - 전문가 ID: ${advisorId}`);
  try {
    // MSW 환경에서는 안정적인 엔드포인트 사용
    const endpoint =
      import.meta.env.VITE_USE_MSW === 'true'
        ? `/api/v1/advisors/${advisorId}/bookmark`
        : API_ENDPOINTS.bookmarkToggle(advisorId);

    const response = await axiosInstance.post(endpoint);
    console.log('✅ API 응답: 북마크 토글 성공');
    return response.data;
  } catch (error) {
    console.error(`❌ 북마크 토글 실패 - 전문가 ID: ${advisorId}:`, error);

    // MSW 환경에서 에러 발생 시 기본 응답 반환
    if (import.meta.env.VITE_USE_MSW === 'true') {
      console.log('🔖 MSW 환경: 기본 북마크 응답 반환');
      return {
        bookmarked: true,
        message: '북마크가 추가되었습니다.',
      };
    }
    throw error;
  }
};

// 북마크 제거 (명세서에 없음 - 프로젝트 전용)
export const removeBookmarkApi = async (bookmarkId: number) => {
  console.log(`🔖 API 호출: 북마크 제거 - ID: ${bookmarkId}`);
  try {
    const response = await axiosInstance.delete(
      `/api/v1/bookmarks/${bookmarkId}`,
    );
    console.log('✅ API 응답: 북마크 제거 성공');
    return response.data;
  } catch (error) {
    console.error(`❌ 북마크 제거 실패 - ID: ${bookmarkId}:`, error);
    throw error;
  }
};
