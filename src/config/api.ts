import axios from 'axios';

// API 기본 설정 - 환경에 따른 자동 전환
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:5173'
    : 'https://api.moneybuddy.com');

export const MSW_CONFIG = {
  enabled: import.meta.env.VITE_USE_MSW === 'true',
  debug: import.meta.env.VITE_MSW_DEBUG === 'true',
  logRequests: import.meta.env.VITE_MSW_LOG_REQUESTS === 'true',
  logResponses: import.meta.env.VITE_MSW_LOG_RESPONSES === 'true',
};

export const API_CONFIG = {
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  retryCount: parseInt(import.meta.env.VITE_API_RETRY_COUNT || '3'),
  retryDelay: parseInt(import.meta.env.VITE_API_RETRY_DELAY || '1000'),
};

// API 엔드포인트 정의
export const API_ENDPOINTS = {
  // 유저 기능 (User)
  signup: '/api/v1/users',
  login: '/api/v1/users/login',
  userProfile: '/api/v1/users/me',
  updateUser: (id: number) => `/api/v1/users/${id}`,
  deleteUser: (id: number) => `/api/v1/users/${id}`,
  getUserById: (id: number) => `/api/v1/users/${id}`,
  publicProfile: (id: number) => `/api/v1/users/${id}/profile`,
  userSettings: (userId: number) => `/api/v1/users/${userId}/settings`,
  recoverUser: '/api/v1/users/recover',

  // 인증 기능 (Auth)
  logout: '/api/v1/auth/logout',
  refresh: '/api/v1/auth/refresh',
  unlinkSocial: '/api/v1/auth/unlink',
  changePassword: '/api/v1/auth/change-password',
  verifyPassword: '/api/v1/auth/verify-password',
  verifyPasswordWithdraw: '/api/v1/auth/verify-password-withdraw',
  findId: '/api/v1/auth/find-id',
  requestResetPassword: '/api/v1/auth/request-reset-password',
  verifyResetCode: '/api/v1/auth/verify-reset-code',
  resetPassword: '/api/v1/auth/reset-password',

  // 소셜 로그인
  kakaoLogin: '/api/v1/auth/kakao',
  googleLogin: '/api/v1/auth/google',
  naverLogin: '/api/v1/auth/naver',

  // 전문가 기능 (Advisor)
  advisors: '/api/v1/advisors',
  advisorDetail: (id: number) => `/api/v1/advisors/${id}`,
  advisorByUserId: (userId: number) => `/api/v1/advisors/user/${userId}`,
  advisorOnlineStatus: (id: number) => `/api/v1/advisors/${id}/online-status`,
  advisorAvailability: (id: number) => `/api/v1/advisors/${id}/availability`,
  advisorExists: (userId: number) => `/api/v1/advisors/exists/user/${userId}`,

  // 카테고리 기능 (Category)
  categories: '/api/v1/categories',
  categoriesByType: (type: string) => `/api/v1/categories/type/${type}`,
  categoryDetail: (id: number) => `/api/v1/categories/${id}`,

  // 상담 기능 (Consultation)
  consultations: '/api/v1/consultation/rooms',
  consultationDetail: (roomId: number) =>
    `/api/v1/consultation/rooms/${roomId}/detail`,
  consultationMessages: (roomId: number) =>
    `/api/v1/consultation/rooms/${roomId}/messages`,
  consultationRead: (roomId: number) =>
    `/api/v1/consultation/rooms/${roomId}/read`,
  consultationLeave: (roomId: number) =>
    `/api/v1/consultation/rooms/${roomId}/leave`,
  consultationStatus: (roomId: number) =>
    `/api/v1/consultation/rooms/${roomId}/status`,
  consultationImage: (roomId: number) => `/api/v1/consultation/${roomId}/image`,

  // 챌린지 기능 (Challenge)
  challenges: '/api/v1/challenges',
  challengeDetail: (id: number) => `/api/v1/challenges/${id}`,
  challengeParticipate: (id: number) => `/api/v1/challenges/${id}/participate`,
  userChallengeParticipations: (userId: number) =>
    `/api/v1/users/${userId}/challenge-participations`,
  challengeParticipationDetail: (id: number) =>
    `/api/v1/challenge-participations/${id}`,

  // 미션 기능 (Mission)
  createMission: (participationId: number) =>
    `/api/v1/admin/challenge-participations/${participationId}/missions`,
  missionsByParticipation: (participationId: number) =>
    `/api/v1/challenge-participations/${participationId}/missions`,
  missionDetail: (id: number) => `/api/v1/missions/${id}`,
  missionStatus: (id: number) => `/api/v1/missions/${id}/status`,
  missionFeedbacks: (id: number) => `/api/v1/missions/${id}/feedbacks`,
  missionUploads: (id: number) => `/api/v1/missions/${id}/uploads`,

  // 리포트 기능 (Report)
  reports: '/api/v1/reports',
  reportDetail: (id: number) => `/api/v1/reports/${id}`,
  userReports: (userId: number) => `/api/v1/reports/users/${userId}`,

  // CS 기능 (Customer Service)
  csInquiries: '/api/v1/cs-inquiries',
  userCsInquiries: (userId: number) => `/api/v1/users/${userId}/cs-inquiries`,
  csInquiryDetail: (id: number) => `/api/v1/cs-inquiries/${id}`,
  adminCsInquiries: '/api/v1/admin/cs-inquiries',
  csInquiryStatus: (id: number) => `/api/v1/admin/cs-inquiries/${id}/status`,

  // 관리자 기능 (Admin)
  notices: '/api/v1/notices',
  noticeDetail: (id: number) => `/api/v1/notices/${id}`,
  adminNotices: '/api/v1/admin/notices',
  adminNoticeDetail: (id: number) => `/api/v1/admin/notices/${id}`,
  faqs: '/api/v1/faqs',
  faqDetail: (id: number) => `/api/v1/faqs/${id}`,
  adminFaqs: '/api/v1/admin/faqs',
  adminFaqDetail: (id: number) => `/api/v1/admin/faqs/${id}`,

  // Webhook 기능 (Webhook)
  webhooks: '/api/v1/admin/webhooks',
  webhookDetail: (id: number) => `/api/v1/admin/webhooks/${id}`,

  // 프로젝트 전용 기능
  getMonthlyExperts: '/api/v1/experts/monthly',
  bookmarks: '/api/v1/bookmarks',
  bookmarkToggle: (advisorId: number) =>
    `/api/v1/bookmarks/toggle/${advisorId}`,
  // MSW 환경용 북마크 API
  advisorBookmark: (advisorId: number) =>
    `/api/v1/advisors/${advisorId}/bookmark`,
  reservations: '/api/v1/reservations',
  reservationDetail: (id: number) => `/api/v1/reservations/${id}`,
  reservationCancel: (id: number) => `/api/v1/reservations/${id}/cancel`,
  payments: '/api/v1/payments',
  paymentDetail: (id: number) => `/api/v1/payments/${id}`,
};

// API 응답 타입 정의
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// 페이징 관련 타입
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
}

// Axios 인스턴스 생성 - 환경별 자동 설정
export const createApiInstance = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_CONFIG.timeout,
    withCredentials: true, // 쿠키 기반 인증
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // 요청 인터셉터 - 개발/프로덕션 환경 구분
  instance.interceptors.request.use(
    config => {
      if (MSW_CONFIG.enabled && MSW_CONFIG.logRequests) {
        console.log('🚀 MSW 모드 API 요청:', config.url);
      } else if (!MSW_CONFIG.enabled) {
        console.log('🌐 실제 API 요청:', config.url);
      }
      return config;
    },
    error => {
      console.error('❌ API 요청 오류:', error);
      return Promise.reject(error);
    },
  );

  // 응답 인터셉터 - 에러 처리 및 재시도
  instance.interceptors.response.use(
    response => {
      if (MSW_CONFIG.enabled && MSW_CONFIG.logResponses) {
        console.log('✅ MSW 모드 API 응답:', response.data);
      }
      return response;
    },
    async error => {
      const originalRequest = error.config;

      // MSW 환경에서 북마크 API 오류 특별 처리 - 더 광범위한 패턴 매칭
      if (
        MSW_CONFIG.enabled &&
        error.config?.url &&
        (error.config.url.includes('/bookmark') ||
          (error.config.url.includes('advisors') &&
            error.config.url.includes('bookmark'))) &&
        error.response?.status === 500
      ) {
        console.warn('⚠️ MSW: 북마크 API 오류 감지, 기본 응답 반환');
        return Promise.resolve({
          data: { bookmarked: true, message: '북마크가 추가되었습니다.' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: error.config,
        });
      }

      // 401 에러 (토큰 만료) - MSW 모드가 아닐 때만 실행
      if (
        error.response?.status === 401 &&
        !MSW_CONFIG.enabled &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          console.log('🔄 토큰 만료로 인한 토큰 재발급 시도');
          await instance.post('/api/v1/auth/refresh', null, {
            withCredentials: true,
            headers: { Authorization: undefined },
          });

          // 토큰 재발급 성공 시 원래 요청 재시도
          return instance.request(originalRequest);
        } catch (refreshError) {
          // 토큰 재발급 실패 시 로그아웃 처리
          console.error('❌ 토큰 재발급 실패, 로그아웃 처리');
          if (typeof window !== 'undefined') {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }

      // 네트워크 오류 시 재시도 로직 (실제 API만)
      if (!MSW_CONFIG.enabled && !originalRequest._retryCount) {
        originalRequest._retryCount = 0;
      }

      if (
        !MSW_CONFIG.enabled &&
        originalRequest._retryCount < API_CONFIG.retryCount &&
        (!error.response || error.response.status >= 500)
      ) {
        originalRequest._retryCount++;
        console.log(
          `🔄 API 재시도 ${originalRequest._retryCount}/${API_CONFIG.retryCount}`,
        );

        await new Promise(resolve =>
          setTimeout(resolve, API_CONFIG.retryDelay),
        );
        return instance.request(originalRequest);
      }

      console.error('❌ API 오류:', error.response?.data || error.message);
      return Promise.reject(error);
    },
  );

  return instance;
};

// API 인스턴스 생성 및 export
export const axiosInstance = createApiInstance();
