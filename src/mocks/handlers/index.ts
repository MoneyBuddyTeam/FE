import { http, HttpResponse } from 'msw';
import { authHandlers } from './auth';
import { findIdHandlers } from './auth/findIdHandlers';
import { resetPasswordHandlers } from './auth/resetPasswordHandlers';
import { authPasswordHandlers } from './auth/authPasswordHandlers';
import { socialLoginHandlers } from './auth/socialLoginHandlers';
import { userInfoHandlers } from './user/userInfoHandlers';
import { advisorHandlers } from './advisor/advisorHandlers';
import { paymentHandlers as paymentHandlersFromFile } from './payment/paymentHandlers';
import { withdrawHandlers as withdrawHandlersFromFile } from './withdrawHandlers';
import { expertData } from '../../data/expertData';
import { chatHandlers } from './chat/chatHandler';
import { searchHandlers } from './search/searchHandler';
import { bookmarkHandlers } from './bookmarks/bookmarkHandlers';

// 사용자 정보 조회 핸들러
const userHandler = http.get('/api/v1/users/me', ({ request }) => {
  const authHeader = request.headers.get('Authorization');

  // 토큰이 있으면 성공 응답
  if (authHeader) {
    return HttpResponse.json({
      id: 1,
      nickname: 'loginUser',
      email: 'user@login.com',
      role: 'USER',
    });
  }

  return HttpResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
});

const bookmarkHandler = http.post(
  '/api/v1/advisors/:advisorId/bookmark',
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

// 추가 북마크 핸들러들
const additionalBookmarkHandlers = [
  // 기존 북마크 토글 API 경로
  http.post('/api/v1/bookmarks/:advisorId', ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ 북마크: 인증되지 않은 사용자');
      return HttpResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 },
      );
    }

    const advisorId = Number(params.advisorId);
    console.log('🔖 기존 북마크 핸들러 호출됨:', advisorId);
    return HttpResponse.json({
      bookmarked: true,
      message: '북마크가 토글되었습니다.',
    });
  }),

  // bookmarkApi.ts에서 사용하는 토글 경로
  http.post('/api/v1/bookmarks/toggle/:advisorId', ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ 북마크: 인증되지 않은 사용자');
      return HttpResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 },
      );
    }

    const advisorId = Number(params.advisorId);
    console.log('🔖 토글 북마크 핸들러 호출됨:', advisorId);
    return HttpResponse.json({
      bookmarked: true,
      message: '북마크가 토글되었습니다.',
    });
  }),
];

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

// 전문가 리스트 및 상세 핸들러 (ExpertListPage, ExpertDetailPage용)

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

// 회원탈퇴 핸들러
const withdrawHandler = http.post(
  '/api/v1/auth/withdraw',
  async ({ request }) => {
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
  },
);

// 기본 헬스체크 핸들러만 유지
export const defaultHandlers = [
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),
];

// 모든 핸들러들을 하나로 통합하여 export
export const handlers = [
  // 사용자 정보 조회
  http.get('/api/v1/users/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 토큰이 있으면 성공 응답
    if (authHeader) {
      return HttpResponse.json({
        id: 1,
        nickname: 'loginUser',
        email: 'user@login.com',
        role: 'USER',
      });
    }

    return HttpResponse.json(
      { message: '인증이 필요합니다.' },
      { status: 401 },
    );
  }),
  ...defaultHandlers,
  ...authHandlers,
  ...findIdHandlers,
  ...resetPasswordHandlers,
  ...authPasswordHandlers,
  ...socialLoginHandlers,
  ...userInfoHandlers,
  ...advisorHandlers, // experthandlers는 제거하고 advisorHandlers만 사용
  ...paymentHandlersFromFile,
  ...withdrawHandlersFromFile,
  ...chatHandlers,
  ...searchHandlers,
  ...bookmarkHandlers,
];

export const otherHandlers = [
  ...reservationHandlers,
  ...paymentHandlers,
  ...consultationHandlers,
];
