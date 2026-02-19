import { http, HttpResponse } from 'msw';
import { authHandlers } from './auth';
import { findIdHandlers } from './auth/findIdHandlers';
import { resetPasswordHandlers } from './auth/resetPasswordHandlers';
import { authPasswordHandlers } from './auth/authPasswordHandlers';
import { socialLoginHandlers } from './auth/socialLoginHandlers';
import { userInfoHandlers } from './user/userInfoHandlers';
import { advisorHandlers } from './advisor/advisorHandlers';
import { paymentHandlers as paymentHandlersFromFile } from './payment/paymentHandlers';
import { withdrawHandlers as withdrawHandlersFromFile } from './auth/withdrawHandlers';
import { challengeHandlers } from './challenge/challengeHandlers';
import { consultationHandlers as consultationRoomHandlers } from './consultation/consultationHandlers';
import { chatHandlers } from './chat/chatHandler';
import { searchHandlers } from './search/searchHandler';
import { bookmarkHandlers } from './bookmarks/bookmarkHandlers';

// 사용자 정보 조회 핸들러

// 추가 북마크 핸들러들

// 예약 관련 핸들러 - 상담 채팅방 생성으로 통합
const reservationHandlers = [
  // 예약 목록 조회 - 상담 채팅방 목록과 통합
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

    // 상담 채팅방 형태로 예약 데이터 변환
    const reservations = [
      {
        id: 1,
        consultationRoomId: 1001, // 상담 채팅방 ID 추가
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
        topic: '금융 문제 고민', // 상담 주제 추가
        durationMinutes: 30, // 상담 시간 추가
        amount: 30000, // 결제 금액
        request:
          '더미 텍스트 최근 경제 상황의 불확실성이 커지면서 자산 포트폴리오 재조정에 대한 고민이 많습니다. 현재 주식, 예금, 펀드 등으로 나뉘어 있는데, 인플레이션과 금리 변동에 대비하여 안정적인 수익을 창출할 수 있는 방법이 궁금합니다. 특히 은퇴 후를 위한 노후 자금 마련과 연금 설계는 어떻게 해야 할지 막막합니다. 또한, 예상치 못한 상황에 대비한 비상 자금 확보와 보험의 필요성에 대해서도 상담받고 싶습니다. 전체적인 재무 목표를 설정하고 효율적인 자산 관리 전략을 세우는 데 전문가의 도움이 절실합니다.',
      },
      {
        id: 2,
        consultationRoomId: 1002,
        expertName: '이지선',
        expertId: 2,
        date: '2024.02.01',
        time: '오후 2:00',
        status: '예약 확정',
        price: 50000,
        paymentMethod: '카카오페이',
        paymentDate: '2024.01.28',
        topic: '투자 상담',
        durationMinutes: 60,
        amount: 50000,
      },
    ];
    return HttpResponse.json(reservations);
  }),

  // 예약 상세 조회 - 상담 채팅방 상세와 통합
  http.get('/api/v1/reservations/:id', ({ params }) => {
    const reservation = {
      id: Number(params.id),
      consultationRoomId: 1001,
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
      topic: '금융 문제 고민',
      durationMinutes: 30,
      amount: 30000,
      request:
        '더미 텍스트 최근 경제 상황의 불확실성이 커지면서 자산 포트폴리오 재조정에 대한 고민이 많습니다. 현재 주식, 예금, 펀드 등으로 나뉘어 있는데, 인플레이션과 금리 변동에 대비하여 안정적인 수익을 창출할 수 있는 방법이 궁금합니다. 특히 은퇴 후를 위한 노후 자금 마련과 연금 설계는 어떻게 해야 할지 막막합니다. 또한, 예상치 못한 상황에 대비한 비상 자금 확보와 보험의 필요성에 대해서도 상담받고 싶습니다. 전체적인 재무 목표를 설정하고 효율적인 자산 관리 전략을 세우는 데 전문가의 도움이 절실합니다.',
    };
    return HttpResponse.json(reservation);
  }),

  // 예약 취소 - 상담 채팅방 나가기로 통합
  http.patch('/api/v1/reservations/:id/cancel', ({ params }) => {
    return HttpResponse.json({
      id: Number(params.id),
      status: '취소됨',
      message: '예약이 취소되었습니다.',
    });
  }),

  // 상담 채팅방 생성 (예약 생성과 통합) - 명세서: POST /api/v1/consultation/rooms
  http.post('/api/v1/consultation/rooms', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 },
      );
    }

    try {
      const body = (await request.json()) as {
        consultantId: number;
        topic: string;
        durationMinutes: number;
        amount: number;
        paymentMethod: string;
      };

      console.log('🏠 상담 채팅방 생성 요청:', body);

      // 새로운 상담 채팅방 ID 생성
      const newRoomId = Math.floor(Math.random() * 9000) + 1000;

      console.log('✅ 상담 채팅방 생성 성공:', newRoomId);

      // 명세서에 따라 상담 채팅방 ID만 반환
      return HttpResponse.json(newRoomId);
    } catch (error) {
      console.error('❌ 상담 채팅방 생성 실패:', error);
      return HttpResponse.json(
        { message: '상담 채팅방 생성에 실패했습니다.' },
        { status: 500 },
      );
    }
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

// 상담 관련 핸들러 추가 - 명세서 준수 경로로 변경
const consultationHandlers = [
  // 상담 목록 조회 - 명세서: GET /api/v1/consultation/rooms
  http.get('/api/v1/consultation/rooms', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 체크
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ 상담 목록: 인증되지 않은 사용자');
      return HttpResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 },
      );
    }

    // 명세서에 맞는 상담 채팅방 목록 응답 형식
    const consultationRooms = [
      {
        consultationRoomId: 1001,
        topic: '우울증과 스트레스 관리',
        opponentUserId: 15,
        opponentNickname: 'jenny88',
        opponentProfileImage: 'https://cdn.moneybuddy.com/profiles/jenny88.jpg',
        lastMessage: '조금 늦을 수도 있어요',
        lastMessageAt: '2025-04-25T16:30:00',
        isClosed: false,
        unreadCount: 2,
      },
      {
        consultationRoomId: 1002,
        topic: '불안장애 상담',
        opponentUserId: 12,
        opponentNickname: 'johnny92',
        opponentProfileImage:
          'https://cdn.moneybuddy.com/profiles/johnny92.jpg',
        lastMessage: '안녕하세요! 상담 시작하겠습니다.',
        lastMessageAt: '2025-04-24T14:20:00',
        isClosed: true,
        unreadCount: 0,
      },
    ];

    return HttpResponse.json(consultationRooms);
  }),

  // 상담 상세 조회 - 명세서: GET /api/v1/consultation/rooms/{id}/detail
  http.get('/api/v1/consultation/rooms/:id/detail', ({ params }) => {
    const consultationRoomId = Number(params.id);

    const consultationDetail = {
      consultationRoomId: consultationRoomId,
      topic: '불안장애',
      opponentNickname: 'johnny92',
      opponentProfileImage: 'https://cdn.moneybuddy.com/profiles/johnny92.jpg',
    };

    return HttpResponse.json(consultationDetail);
  }),

  // 메시지 목록 조회 - 명세서: GET /api/v1/consultation/rooms/{roomId}/messages
  http.get('/api/v1/consultation/rooms/:roomId/messages', ({ params }) => {
    const roomId = Number(params.roomId);

    const messages = [
      {
        id: 1,
        consultationRoomId: roomId,
        senderId: 1,
        senderNickname: '사용자1',
        content: '안녕하세요, 상담 요청드립니다.',
        sentAt: '2025-04-25T16:00:00',
        messageType: 'TEXT',
      },
      {
        id: 2,
        consultationRoomId: roomId,
        senderId: 15,
        senderNickname: 'jenny88',
        content: '네, 안녕하세요! 어떤 고민이 있으신가요?',
        sentAt: '2025-04-25T16:05:00',
        messageType: 'TEXT',
      },
    ];

    return HttpResponse.json({ messages, last: true });
  }),

  // 메시지 읽음 처리 - 명세서: PATCH /api/v1/consultation/rooms/{roomId}/read
  http.patch('/api/v1/consultation/rooms/:roomId/read', ({ params }) => {
    console.log(`📖 메시지 읽음 처리 - Room ID: ${params.roomId}`);
    return new HttpResponse(null, { status: 204 });
  }),

  // 채팅방 나가기 - 명세서: DELETE /api/v1/consultation/rooms/{roomId}/leave
  http.delete('/api/v1/consultation/rooms/:roomId/leave', ({ params }) => {
    console.log(`🚪 채팅방 나가기 - Room ID: ${params.roomId}`);
    return new HttpResponse(null, { status: 204 });
  }),

  // 상담 상태 변경 - 명세서: PATCH /api/v1/consultation/rooms/{id}/status
  http.patch(
    '/api/v1/consultation/rooms/:id/status',
    async ({ params, request }) => {
      try {
        const body = (await request.json()) as {
          userId: number;
          newStatus: string;
        };

        console.log(
          `🔄 상담 상태 변경 - Room ID: ${params.id}, Status: ${body.newStatus}`,
        );
        return new HttpResponse(null, { status: 204 });
      } catch (error) {
        return HttpResponse.json(
          { message: '상담 상태 변경에 실패했습니다.' },
          { status: 400 },
        );
      }
    },
  ),

  // 이미지 업로드 - 명세서: POST /api/v1/consultation/{consultationRoomId}/image
  http.post(
    '/api/v1/consultation/:consultationRoomId/image',
    async ({ params, request }) => {
      try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
          return HttpResponse.json(
            { message: '이미지 파일이 필요합니다.' },
            { status: 400 },
          );
        }

        // 가상의 이미지 URL 생성
        const imageUrl = `https://moneytalk-s3.s3.ap-northeast-2.amazonaws.com/chat-images/${Date.now()}-${file.name}`;

        console.log(
          `📷 이미지 업로드 성공 - Room ID: ${params.consultationRoomId}`,
        );
        return HttpResponse.json({ imageUrl });
      } catch (error) {
        return HttpResponse.json(
          { message: '이미지 업로드에 실패했습니다.' },
          { status: 500 },
        );
      }
    },
  ),
];

// 마이페이지 관련 핸들러 추가

// 회원탈퇴 핸들러

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
  ...withdrawHandlersFromFile, // 더 구체적인 패턴이므로 먼저 등록
  ...socialLoginHandlers,
  ...userInfoHandlers,
  ...advisorHandlers, // experthandlers는 제거하고 advisorHandlers만 사용
  ...paymentHandlersFromFile,
  ...chatHandlers,
  ...searchHandlers,
  ...bookmarkHandlers,
  ...challengeHandlers,
  ...consultationRoomHandlers,
];

export const otherHandlers = [
  ...reservationHandlers,
  ...paymentHandlers,
  ...consultationHandlers,
];
