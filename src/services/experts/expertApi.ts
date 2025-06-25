import { axiosInstance } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type {
  Expert,
  ExpertFilterParams,
  ExpertListResponse,
} from '../../types/expert';
import type { MonthlyExpert } from '../../types/api/expert/expert';
import type { CategoryResponse } from '../../types/expert';
import type {
  CreateChallengeRequest,
  CreateChallengeResponse,
} from '../../types/auth';

interface ExpertResponse {
  content: MonthlyExpert[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
}

// 월간 전문가 조회
export const getMonthlyExperts = async (
  page: number = 0,
  size: number = 5,
): Promise<ExpertResponse> => {
  const response = await axiosInstance.get(API_ENDPOINTS.advisors, {
    params: { sort: 'rating,desc', page, size },
    // params: { sort: 'monthly', page, size },
  });

  // API 응답이 이미 ExpertResponse 형식인 경우 그대로 반환
  if (response.data.content && response.data.pageable) {
    return response.data;
  }

  // API 응답이 배열인 경우 ExpertResponse 형식으로 변환
  const experts = Array.isArray(response.data)
    ? response.data
    : response.data.advisors || [];

  return {
    content: experts,
    pageable: {
      pageNumber: page,
      pageSize: size,
    },
    totalPages: Math.ceil(experts.length / size),
    totalElements: experts.length,
  };
};

// 전문가 목록 조회 (명세서: GET /api/v1/advisors)
export const getExperts = async (
  params?: ExpertFilterParams,
): Promise<ExpertListResponse> => {
  console.log('🔍 API 호출: 전문가 목록 조회', params);
  const response = await axiosInstance.get(API_ENDPOINTS.advisors, { params });
  console.log('✅ API 응답: 전문가 목록 조회 성공', response.data);

  const result = {
    experts: response.data.content || response.data.experts || [],
    total: response.data.totalElements || response.data.total || 0,
    page: response.data.pageable?.pageNumber || response.data.page || 1,
    limit: response.data.pageable?.pageSize || response.data.limit || 10,
    hasMore:
      (response.data.pageable?.pageNumber || 0) < response.data.totalPages - 1,
  };

  console.log('🔄 변환된 응답:', result);
  return result;
};

// 전문가 상세 조회 (명세서: GET /api/v1/advisors/{advisorId})
export const getExpertById = async (id: number): Promise<Expert> => {
  console.log(`🔍 API 호출: 전문가 상세 조회 - ID: ${id}`);
  const response = await axiosInstance.get(API_ENDPOINTS.advisorDetail(id));
  console.log(`✅ API 응답: 전문가 상세 조회 성공`);
  return response.data;
};

// 카테고리 목록 조회 (명세서: GET /api/v1/categories)
export const getCategories = async (): Promise<CategoryResponse[]> => {
  const response = await axiosInstance.get(API_ENDPOINTS.categories);
  return response.data;
};

// 북마크 목록 조회
export const getBookmarks = async (): Promise<Expert[]> => {
  console.log('🔖 API 호출: 북마크 목록 조회');
  const response = await axiosInstance.get(API_ENDPOINTS.bookmarks);
  console.log('✅ API 응답: 북마크 목록 조회 성공');
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
    `${API_ENDPOINTS.bookmarks}/${expertId}/toggle`,
  );
  console.log(`✅ 북마크 토글 성공`);
  return response.data;
};

// 상담 관련 API 함수
export const getConsultations = async () => {
  console.log('💬 API 호출: 상담 내역 조회');
  const response = await axiosInstance.get(API_ENDPOINTS.consultations);
  console.log('✅ API 응답: 상담 내역 조회 성공');
  return response.data;
};

export const getConsultationById = async (consultationId: number) => {
  console.log(`💬 API 호출: 상담 상세 조회 - ID: ${consultationId}`);
  const response = await axiosInstance.get(
    API_ENDPOINTS.consultationDetail(consultationId),
  );
  console.log(`✅ API 응답: 상담 상세 조회 성공`);
  return response.data;
};

export const cancelConsultation = async (roomId: number) => {
  console.log(`❌ API 호출: 상담 취소 - Room ID: ${roomId}`);
  const response = await axiosInstance.delete(
    API_ENDPOINTS.consultationLeave(roomId),
  );
  console.log(`✅ API 응답: 상담 취소 성공`);
  return response.data;
};

// 챌린지 API 함수들 추가
export const getChallenges = async () => {
  console.log('🏆 API 호출: 챌린지 목록 조회');
  const response = await axiosInstance.get(API_ENDPOINTS.challenges);
  console.log('✅ API 응답: 챌린지 목록 조회 성공');
  return response.data;
};

// 챌린지 생성 - 명세서 준수 (POST /api/v1/challenges)
export const createChallenge = async (
  challengeData: CreateChallengeRequest,
): Promise<CreateChallengeResponse> => {
  console.log('🏆 API 호출: 챌린지 생성 (관리자/전문가)');
  const response = await axiosInstance.post(
    API_ENDPOINTS.challenges,
    challengeData,
  );
  console.log('✅ API 응답: 챌린지 생성 성공');
  return response.data;
};

export const getChallengeById = async (challengeId: number) => {
  console.log(`🏆 API 호출: 챌린지 상세 조회 - ID: ${challengeId}`);
  const response = await axiosInstance.get(
    API_ENDPOINTS.challengeDetail(challengeId),
  );
  console.log(`✅ API 응답: 챌린지 상세 조회 성공`);
  return response.data;
};

// 카테고리 타입별 조회 추가
export const getCategoriesByType = async (type: string) => {
  console.log(`📂 API 호출: 타입별 카테고리 조회 - Type: ${type}`);
  const response = await axiosInstance.get(
    API_ENDPOINTS.categoriesByType(type),
  );
  console.log(`✅ API 응답: 타입별 카테고리 조회 성공`);
  return response.data;
};

// 카테고리 상세 조회 추가
export const getCategoryById = async (categoryId: number) => {
  console.log(`📂 API 호출: 카테고리 상세 조회 - ID: ${categoryId}`);
  const response = await axiosInstance.get(
    API_ENDPOINTS.categoryDetail(categoryId),
  );
  console.log(`✅ API 응답: 카테고리 상세 조회 성공`);
  return response.data;
};

// 상담 메시지 조회 API 추가
export const getConsultationMessages = async (
  roomId: number,
  page: number = 0,
  size: number = 20,
) => {
  console.log(
    `💬 API 호출: 메시지 목록 조회 - Room ID: ${roomId}, Page: ${page}`,
  );
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.consultationMessages(roomId)}?page=${page}&size=${size}`,
  );
  console.log(`✅ API 응답: 메시지 목록 조회 성공`);
  return response.data;
};

// 인증 필요 API 함수
export const getUserChallengeParticipations = async (userId: number) => {
  console.log(`🏆 API 호출: 사용자 챌린지 참여 내역 조회 - User ID: ${userId}`);
  const response = await axiosInstance.get(
    API_ENDPOINTS.userChallengeParticipations(userId),
  );
  console.log('✅ API 응답: 사용자 챌린지 참여 내역 조회 성공');
  return response.data;
};

export const participateInChallenge = async (challengeId: number) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.challengeParticipate(challengeId),
  );
  return response.data;
};

export const getChallengeParticipationDetail = async (
  participationId: number,
) => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.challengeParticipationDetail(participationId),
  );
  return response.data;
};

// 전문가 등록 API (명세서: POST /api/v1/advisors)
export const registerAdvisor = async (advisorData: {
  name: string;
  bio: string;
  certificationFile: string;
  available: boolean;
  price: number;
  isOnline: boolean;
}) => {
  console.log('👨‍🏫 API 호출: 전문가 등록');
  const response = await axiosInstance.post(
    API_ENDPOINTS.advisors,
    advisorData,
  );
  console.log('✅ API 응답: 전문가 등록 성공');
  return response.data;
};

// 챌린지 생성 API - (POST /api/v1/challenges)
export const createChallengeAdmin = async (
  challengeData: CreateChallengeRequest,
): Promise<CreateChallengeResponse> => {
  console.log('🏆 API 호출: 챌린지 생성 (관리자/전문가)');
  const response = await axiosInstance.post(
    API_ENDPOINTS.challenges,
    challengeData,
  );
  console.log('✅ API 응답: 챌린지 생성 성공');
  return response.data;
};

// 사용자 ID로 전문가 조회 (명세서: GET /api/v1/advisors/user/{userId})
export const getAdvisorByUserId = async (userId: number): Promise<Expert> => {
  console.log(`🔍 API 호출: 사용자 ID로 전문가 조회 - 사용자 ID: ${userId}`);
  const response = await axiosInstance.get(
    API_ENDPOINTS.advisorByUserId(userId),
  );
  console.log('✅ API 응답: 사용자 ID로 전문가 조회 성공');
  return response.data;
};

// 전문가 등록 여부 확인 (명세서: GET /api/v1/advisors/exists/user/{userId})
export const checkAdvisorExists = async (userId: number): Promise<boolean> => {
  console.log(`🔍 API 호출: 전문가 등록 여부 확인 - 사용자 ID: ${userId}`);
  const response = await axiosInstance.get(API_ENDPOINTS.advisorExists(userId));
  console.log('✅ API 응답: 전문가 등록 여부 확인 성공');
  return response.data;
};

// 온라인 상태 업데이트 (명세서: PUT /api/v1/advisors/{advisorId}/online-status)
export const updateAdvisorOnlineStatus = async (
  advisorId: number,
  isOnline: boolean,
): Promise<void> => {
  console.log(
    `🔄 API 호출: 전문가 온라인 상태 업데이트 - ID: ${advisorId}, 온라인: ${isOnline}`,
  );
  await axiosInstance.put(API_ENDPOINTS.advisorOnlineStatus(advisorId), null, {
    params: { isOnline },
  });
  console.log('✅ API 응답: 전문가 온라인 상태 업데이트 성공');
};

// 상담 가능 여부 업데이트 (명세서: PUT /api/v1/advisors/{advisorId}/availability)
export const updateAdvisorAvailability = async (
  advisorId: number,
  available: boolean,
): Promise<void> => {
  console.log(
    `🔄 API 호출: 전문가 상담 가능 여부 업데이트 - ID: ${advisorId}, 가능: ${available}`,
  );
  await axiosInstance.put(API_ENDPOINTS.advisorAvailability(advisorId), null, {
    params: { available },
  });
  console.log('✅ API 응답: 전문가 상담 가능 여부 업데이트 성공');
};
