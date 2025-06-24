import { http, HttpResponse } from 'msw';
import { authHandlers } from './auth';
import { findIdHandlers } from './auth/findIdHandlers';
import { resetPasswordHandlers } from './auth/resetPasswordHandlers';
import { authPasswordHandlers } from './auth/authPasswordHandlers';
import { userInfoHandlers } from './user/userInfoHandlers';
import { experthandlers } from './expert/expertHandlers';
import { advisorHandlers } from './advisor/advisorHandlers';
import { paymentHandlers as paymentHandlersFromFile } from './payment/paymentHandlers';
import { withdrawHandlers as withdrawHandlersFromFile } from './withdrawHandlers';
import { expertData } from '../../data/expertData';
import { chatHandlers } from './chat/chatHandler';
import { searchHandlers } from './search/searchHandler';

// 월간 전문가 데이터를 expertData에서 가져오도록 수정
const getMonthlyExpertsData = () => {
  return expertData
    .sort((a, b) => b.rating - a.rating) // 평점 순으로 정렬
    .slice(0, 5) // 상위 5명만
    .map((expert, index) => ({
      id: expert.id,
      rank: index + 1,
      name: expert.nickname,
      description: expert.description,
      tags: expert.hashtags,
      rating: expert.rating,
      reviewCount: expert.review_count,
      imgUrl: expert.profile_image,
      isLiked: false,
    }));
};

// 북마크 핸들러를 별도로 먼저 정의
const bookmarkHandler = http.post(
  '/api/v1/bookmarks/:advisorId',
  ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 체크
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ 북마크: 인증되지 않은 사용자');
      return HttpResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 },
      );
    }

    console.log('🔖 북마크 핸들러 호출됨:', params);
    const advisorId = Number(params.advisorId);
    const expert = expertData.find(e => e.id === advisorId);

    if (!expert) {
      console.log('❌ 전문가를 찾을 수 없음:', advisorId);
      return HttpResponse.json(
        { message: '전문가를 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    console.log('✅ 북마크 토글 성공:', expert.nickname);
    return HttpResponse.json({
      bookmarked: true,
      message: '북마크가 토글되었습니다.',
    });
  },
);

// 예약 관련 핸들러
const reservationHandlers = [
  // 예약 목록 조회
  http.get('/api/v1/reservations', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 체크
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ 예약 목록: 인증되지 않은 사용자');
      return HttpResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 },
      );
    }

    const reservations = [
      {
        id: 1,
        expertName: '박재현',
        expertId: 1,
        date: '2025년 1월 25일 월요일',
        time: '오전 10:00~오전 10:30',
        status: '예약 완료',
        price: 30000,
        paymentMethod: '네이버 페이먼츠',
        paymentDate: '2024.01.20',
        consultationType: '전화 상담',
        consultationArea: '금융 문제 고민',
        request:
          '더미 텍스트 최근 경제 상황의 불확실성이 커지면서 자산 포트폴리오 재조정에 대한 고민이 많습니다. 현재 주식, 예금, 펀드 등으로 나뉘어 있는데, 인플레이션과 금리 변동에 대비하여 안정적인 수익을 창출할 수 있는 방법이 궁금합니다. 특히 은퇴 후를 위한 노후 자금 마련과 연금 설계는 어떻게 해야 할지 막막합니다. 또한, 예상치 못한 상황에 대비한 비상 자금 확보와 보험의 필요성에 대해서도 상담받고 싶습니다. 전체적인 재무 목표를 설정하고 효율적인 자산 관리 전략을 세우는 데 전문가의 도움이 절실합니다.',
      },
      {
        id: 2,
        expertName: '이지선',
        expertId: 2,
        date: '2024.02.01',
        time: '오후 2:00',
        status: '예약 확정',
        price: 50000,
        paymentMethod: '카카오페이',
        paymentDate: '2024.01.28',
      },
    ];
    return HttpResponse.json(reservations);
  }),

  // 예약 상세 조회
  http.get('/api/v1/reservations/:id', ({ params }) => {
    const reservation = {
      id: Number(params.id),
      expertName: '박재현',
      expertId: 1,
      expertField: '소비 관리',
      date: '2025년 1월 25일 월요일',
      time: '오전 10:00~오전 10:30',
      status: '예약 완료',
      price: 30000,
      paymentMethod: '네이버 페이먼츠',
      paymentDate: '2024.01.20',
      consultationType: '전화 상담',
      consultationArea: '금융 문제 고민',
      request:
        '더미 텍스트 최근 경제 상황의 불확실성이 커지면서 자산 포트폴리오 재조정에 대한 고민이 많습니다. 현재 주식, 예금, 펀드 등으로 나뉘어 있는데, 인플레이션과 금리 변동에 대비하여 안정적인 수익을 창출할 수 있는 방법이 궁금합니다. 특히 은퇴 후를 위한 노후 자금 마련과 연금 설계는 어떻게 해야 할지 막막합니다. 또한, 예상치 못한 상황에 대비한 비상 자금 확보와 보험의 필요성에 대해서도 상담받고 싶습니다. 전체적인 재무 목표를 설정하고 효율적인 자산 관리 전략을 세우는 데 전문가의 도움이 절실합니다.',
    };
    return HttpResponse.json(reservation);
  }),

  // 예약 취소
  http.patch('/api/v1/reservations/:id/cancel', ({ params }) => {
    return HttpResponse.json({
      id: Number(params.id),
      status: '취소됨',
      message: '예약이 취소되었습니다.',
    });
  }),
];

// 결제 관련 핸들러
const paymentHandlers = [
  // 결제 처리
  http.post('/api/v1/payments', async ({ request }) => {
    const body = (await request.json()) as any;

    // 90% 확률로 성공
    if (Math.random() > 0.1) {
      return HttpResponse.json({
        success: true,
        paymentId: 'payment_' + Date.now(),
        transactionId: 'txn_' + Date.now(),
        message: '결제가 완료되었습니다.',
        ...body,
      });
    } else {
      return HttpResponse.json(
        {
          success: false,
          message: '결제 처리 중 오류가 발생했습니다.',
        },
        { status: 400 },
      );
    }
  }),

  // 결제 확인
  http.get('/api/v1/payments/:paymentId', ({ params }) => {
    return HttpResponse.json({
      paymentId: params.paymentId,
      status: 'completed',
      amount: 30000,
      method: '신용카드',
      paidAt: new Date().toISOString(),
    });
  }),

  // 결제 취소
  http.post('/api/v1/payments/:paymentId/cancel', ({ params }) => {
    return HttpResponse.json({
      paymentId: params.paymentId,
      status: 'cancelled',
      message: '결제가 취소되었습니다.',
    });
  }),
];

// 전문가 상세 조회 핸들러 추가 - MSW에서 처리되도록 수정
const expertDetailHandlers = [
  // 전문가 상세 조회 (/api/v1/experts/:id)
  http.get('/api/v1/experts/:id', ({ params }) => {
    const expertId = Number(params.id);
    const expert = expertData.find(e => e.id === expertId);

    console.log(`🔍 MSW: 전문가 상세 조회 - ID: ${expertId}`);

    if (!expert) {
      console.log(`❌ MSW: 전문가를 찾을 수 없음 - ID: ${expertId}`);
      return HttpResponse.json(
        { message: '전문가를 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    // 추가 상세 정보 포함하여 반환
    const expertDetail = {
      ...expert,
      // 추가 상세 정보
      skills: ['디지털 소비 분석', '예산 관리', '재정 계획'],
      education: ['서울대학교 경영학과', 'CFA Level 3'],
      career: ['금융투자협회 10년', '재무상담사 5년'],
      contact_hours: '평일 10:00 - 19:00',
      response_time: '평균 2시간 이내',
      consultation_formats: ['채팅', '화상', '이메일'],
    };

    console.log(`✅ MSW: 전문가 상세 정보 반환 - ${expert.nickname}`);
    return HttpResponse.json(expertDetail);
  }),
];

// 전문가 리스트 및 상세 핸들러 (ExpertListPage, ExpertDetailPage용)
const expertListHandlers = [
  // 월간 전문가 조회 - expertData에서 동적으로 생성
  http.get('/api/v1/experts/monthly', () => {
    console.log('🎯 MSW: 월간 전문가 데이터 반환 중...');
    return HttpResponse.json(getMonthlyExpertsData());
  }),

  // 전문가 목록 조회 (필터링, 정렬, 페이지네이션 포함)
  http.get('/api/v1/experts', ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const sort = url.searchParams.get('sort');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    // expertData 사용 (실제 데이터)
    let allExperts = [...expertData];

    // 카테고리 필터링
    if (category && category !== '전체') {
      allExperts = allExperts.filter(expert => expert.field === category);
    }

    // 정렬
    if (sort) {
      allExperts.sort((a, b) => {
        switch (sort) {
          case '평점순':
            return b.rating - a.rating;
          case '리뷰많은순':
            return b.review_count - a.review_count;
          case '낮은가격순':
            return a.price - b.price;
          case '높은가격순':
            return b.price - a.price;
          default:
            return 0;
        }
      });
    }

    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedExperts = allExperts.slice(startIndex, endIndex);

    return HttpResponse.json({
      experts: paginatedExperts,
      total: allExperts.length,
      page,
      limit,
      hasMore: endIndex < allExperts.length,
    });
  }),

  // 카테고리 목록 조회
  http.get('/api/v1/categories', () => {
    const categories = [
      { id: 1, name: '소비', description: '소비 관리 및 절약' },
      { id: 2, name: '저축', description: '저축 및 자산 관리' },
      { id: 3, name: '투자', description: '주식 및 투자 상품' },
      { id: 4, name: '부채', description: '부채 관리 및 상환' },
      { id: 5, name: '기타', description: '기타 재무 상담' },
    ];
    return HttpResponse.json(categories);
  }),
  // 새로운 북마크 토글 (새 API 경로)
  http.post('/api/v1/users/bookmarks/:expertId', ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 체크
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ 북마크: 인증되지 않은 사용자');
      return HttpResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 },
      );
    }

    const expertId = Number(params.expertId);
    console.log('🔖 새 북마크 핸들러 호출됨:', expertId);
    return HttpResponse.json({
      expertId,
      bookmarked: true,
      message: '북마크가 추가되었습니다.',
    });
  }),

  // 북마크 목록 조회
  http.get('/api/v1/users/bookmarks', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 체크
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ 북마크 목록: 인증되지 않은 사용자');
      return HttpResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 },
      );
    }

    try {
      // 북마크된 엑스퍼트는 평점이 높거나 리뷰가 많은 엑스퍼트들로 구성
      const bookmarkedExperts = expertData
        .filter(expert => expert.rating >= 4.7) // 평점 4.7 이상
        .slice(0, 8) // 최대 8명
        .map(expert => ({
          ...expert,
          // 북마크된 상태임을 명시
          isBookmarked: true,
        }));

      console.log(
        `✅ MSW: 북마크 목록 조회 성공 - ${bookmarkedExperts.length}개`,
      );
      return HttpResponse.json(bookmarkedExperts);
    } catch (error) {
      console.error('❌ MSW - 북마크 목록 조회 오류:', error);
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  }),
];

// 상담 관련 핸들러 추가
const consultationHandlers = [
  // 상담 목록 조회
  http.get('/api/v1/consultations', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 체크
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ 상담 목록: 인증되지 않은 사용자');
      return HttpResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 },
      );
    }

    const consultations = expertData.slice(0, 3).map((expert, index) => ({
      id: index + 1,
      expertId: expert.id,
      expertName: expert.nickname,
      field: expert.field,
      date:
        index === 0
          ? '2025년 1월 25일 월요일'
          : index === 1
            ? '2025년 1월 20일 토요일'
            : '2025년 1월 15일 월요일',
      time:
        index === 0
          ? '오전 10:00~오전 10:30'
          : index === 1
            ? '오후 2:00~오후 2:30'
            : '오후 4:00~오후 4:30',
      type: index === 0 ? '전화상담' : index === 1 ? '화상상담' : '채팅상담',
      status: index === 0 ? '상담완료' : index === 1 ? '예약완료' : '상담완료',
      amount: expert.price,
      paymentMethod:
        index === 0
          ? '네이버페이먼츠'
          : index === 1
            ? '카카오페이'
            : '토스페이',
      paymentDate:
        index === 0 ? '2024.01.20' : index === 1 ? '2024.01.18' : '2024.01.10',
      consultationArea: `${expert.field} 관련 상담`,
      consultationNotes: `${expert.description}에 대한 상세한 상담을 받고 싶습니다.`,
      reviewStatus:
        index === 0 ? 'available' : index === 2 ? 'completed' : undefined,
    }));
    return HttpResponse.json(consultations);
  }),

  // 상담 상세 조회
  http.get('/api/v1/consultations/:id', ({ params }) => {
    const consultationId = Number(params.id);
    const expert = expertData[consultationId - 1] || expertData[0];

    const consultation = {
      id: consultationId,
      expertId: expert.id,
      expertName: expert.nickname,
      field: expert.field,
      date: '2025년 1월 25일 월요일',
      time: '오전 10:00~오전 10:30',
      type: '전화상담',
      status: '예약완료',
      amount: 30000,
      paymentMethod: '네이버페이먼츠',
      paymentDate: '2024.01.20',
      consultationArea: '금융 문제 고민',
      consultationNotes: `더미 텍스트 최근 경제 상황의 불확실성이 커지면서 자산 포트폴리오 재조정에 대한 고민이 많습니다...`,
      reviewStatus: 'available',
    };
    return HttpResponse.json(consultation);
  }),

  // 상담 취소
  http.patch('/api/v1/consultations/:id/cancel', ({ params }) => {
    return HttpResponse.json({
      id: Number(params.id),
      status: '취소됨',
      message: '상담이 취소되었습니다.',
    });
  }),
];

// 마이페이지 관련 핸들러 추가
const mypageHandlers = [
  // 사용자 정보 조회
  http.get('/api/v1/users/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 체크
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ 마이페이지: 인증되지 않은 사용자');
      return HttpResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      id: 1,
      nickname: '머니버디맨',
      email: 'user@example.com',
      profileImage: '/jpg/experts/expert1.png',
    });
  }),

  // 상담 내역 조회 (마이페이지용)
  http.get('/api/v1/mypage/consultations', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 체크
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ 마이페이지 상담내역: 인증되지 않은 사용자');
      return HttpResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 },
      );
    }

    const consultation = {
      id: 1,
      expertName: '박재현',
      expertImage: '/jpg/experts/expert1.png',
      date: '2025년 1월 25일 월요일',
      time: '오전 10:00~오전 10:30',
      type: '전화 상담',
      status: '예약 완료',
      duration: '1시간',
    };
    return HttpResponse.json(consultation);
  }),

  // 챌린지 정보 조회
  http.get('/api/v1/mypage/challenges', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 체크
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ 마이페이지 챌린지: 인증되지 않은 사용자');
      return HttpResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 },
      );
    }

    const challenge = {
      id: 1,
      title: '챌린지를 수행해주세요',
      deadline: '2025.12.25 까지 (D-00)',
      percentage: 20,
    };
    return HttpResponse.json(challenge);
  }),
];

// 회원탈퇴 관련 핸들러 추가
const withdrawHandlers = [
  // 회원탈퇴 비밀번호 확인
  http.post('/api/v1/auth/verify-password-withdraw', async ({ request }) => {
    const { password } = (await request.json()) as { password: string };
    console.log('🔐 탈퇴 비밀번호 확인:', password);

    // 간단한 비밀번호 검증 (실제로는 서버에서 해시 비교)
    if (password === 'wrongpassword') {
      return HttpResponse.json(
        { message: '틀린 비밀번호 입니다. 다시 입력해주세요.' },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      message: '비밀번호 확인 완료',
      success: true,
    });
  }),
  // 회원탈퇴
  http.post('/api/v1/auth/withdraw', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 체크
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    const { reason } = (await request.json()) as {
      reason: string;
    };
    console.log('🗑️ 회원탈퇴:', { reason });

    return HttpResponse.json({
      message: '회원탈퇴가 완료되었습니다.',
      success: true,
    });
  }),
];

// 기본 헬스체크 핸들러만 유지
export const defaultHandlers = [
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),
];

// 모든 핸들러들을 하나로 통합하여 export
export const handlers = [
  ...authHandlers,
  ...findIdHandlers,
  ...resetPasswordHandlers,
  ...authPasswordHandlers,
  ...userInfoHandlers,
  ...experthandlers,
  ...advisorHandlers,
  ...paymentHandlersFromFile,
  ...withdrawHandlersFromFile,
  ...defaultHandlers,
  ...chatHandlers,
  ...searchHandlers,
];
export const otherHandlers = [
  ...reservationHandlers,
  ...paymentHandlers,
  ...consultationHandlers,
];
