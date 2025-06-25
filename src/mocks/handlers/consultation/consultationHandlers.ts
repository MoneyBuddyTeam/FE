import { http, HttpResponse } from 'msw';
import { validateToken } from '../auth/constants';

// Mock 상담방 데이터
const mockConsultationRooms = [
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
    opponentProfileImage: 'https://cdn.moneybuddy.com/profiles/johnny92.jpg',
    lastMessage: '안녕하세요! 상담 시작하겠습니다.',
    lastMessageAt: '2025-04-24T14:20:00',
    isClosed: true,
    unreadCount: 0,
  },
];

// Mock 메시지 데이터
const mockMessages = [
  {
    id: 1,
    consultationRoomId: 1001,
    senderId: 1,
    senderNickname: '사용자1',
    content: '안녕하세요, 상담 요청드립니다.',
    sentAt: '2025-04-25T16:00:00',
    messageType: 'TEXT',
  },
  {
    id: 2,
    consultationRoomId: 1001,
    senderId: 15,
    senderNickname: 'jenny88',
    content: '네, 안녕하세요! 어떤 부분이 궁금하신가요?',
    sentAt: '2025-04-25T16:05:00',
    messageType: 'TEXT',
  },
  {
    id: 3,
    consultationRoomId: 1001,
    senderId: 15,
    senderNickname: 'jenny88',
    content: '조금 늦을 수도 있어요',
    sentAt: '2025-04-25T16:30:00',
    messageType: 'TEXT',
  },
];

export const consultationHandlers = [
  // 1. 상담 채팅방 생성
  http.post('/api/v1/consultation/rooms', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!validateToken(authHeader)) {
      console.log('❌ MSW: 인증되지 않은 사용자 - POST /consultation/rooms');
      return HttpResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    try {
      const { consultantId, topic } = (await request.json()) as {
        consultantId: number;
        topic: string;
        durationMinutes: number;
        amount: number;
        paymentMethod: string;
      };

      const newRoomId = mockConsultationRooms.length + 1001;

      const newRoom = {
        consultationRoomId: newRoomId,
        topic,
        opponentUserId: consultantId,
        opponentNickname: `상담사${consultantId}`,
        opponentProfileImage: `/jpg/experts/expert${consultantId}.png`,
        lastMessage: '',
        lastMessageAt: new Date().toISOString(),
        isClosed: false,
        unreadCount: 0,
      };

      mockConsultationRooms.push(newRoom);
      console.log('✅ MSW: 상담 채팅방 생성 성공:', newRoomId);

      return HttpResponse.json(newRoomId);
    } catch (error) {
      console.error('❌ MSW: 상담 채팅방 생성 중 오류:', error);
      return HttpResponse.json(
        { message: '잘못된 요청 형식입니다.' },
        { status: 400 },
      );
    }
  }),

  // 2. 채팅방 목록 조회
  http.get('/api/v1/consultation/rooms', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!validateToken(authHeader)) {
      console.log('❌ MSW: 인증되지 않은 사용자 - GET /consultation/rooms');
      return HttpResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    console.log('✅ MSW: 채팅방 목록 조회 성공');
    return HttpResponse.json(mockConsultationRooms);
  }),

  // 3. 채팅방 상세 조회
  http.get(
    '/api/v1/consultation/rooms/:roomId/detail',
    ({ params, request }) => {
      const authHeader = request.headers.get('Authorization');

      if (!validateToken(authHeader)) {
        console.log(
          '❌ MSW: 인증되지 않은 사용자 - GET /consultation/rooms/:roomId/detail',
        );
        return HttpResponse.json(
          { message: '인증이 필요합니다.' },
          { status: 401 },
        );
      }

      const roomId = Number(params.roomId);
      const room = mockConsultationRooms.find(
        r => r.consultationRoomId === roomId,
      );

      if (!room) {
        console.log(`❌ MSW: 채팅방을 찾을 수 없음 - Room ID: ${roomId}`);
        return HttpResponse.json(
          { message: '채팅방을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const roomDetail = {
        consultationRoomId: room.consultationRoomId,
        topic: room.topic,
        opponentNickname: room.opponentNickname,
        opponentProfileImage: room.opponentProfileImage,
      };

      console.log(`✅ MSW: 채팅방 상세 조회 성공 - Room ID: ${roomId}`);
      return HttpResponse.json(roomDetail);
    },
  ),

  // 4. 메시지 목록 조회
  http.get(
    '/api/v1/consultation/rooms/:roomId/messages',
    ({ params, request }) => {
      const authHeader = request.headers.get('Authorization');

      if (!validateToken(authHeader)) {
        console.log(
          '❌ MSW: 인증되지 않은 사용자 - GET /consultation/rooms/:roomId/messages',
        );
        return HttpResponse.json(
          { message: '인증이 필요합니다.' },
          { status: 401 },
        );
      }

      const roomId = Number(params.roomId);
      const roomMessages = mockMessages.filter(
        m => m.consultationRoomId === roomId,
      );

      console.log(`✅ MSW: 메시지 목록 조회 성공 - Room ID: ${roomId}`);
      return HttpResponse.json(roomMessages);
    },
  ),

  // 5. 메시지 읽음 처리
  http.patch(
    '/api/v1/consultation/rooms/:roomId/read',
    ({ params, request }) => {
      const authHeader = request.headers.get('Authorization');

      if (!validateToken(authHeader)) {
        console.log(
          '❌ MSW: 인증되지 않은 사용자 - PATCH /consultation/rooms/:roomId/read',
        );
        return HttpResponse.json(
          { message: '인증이 필요합니다.' },
          { status: 401 },
        );
      }

      const roomId = Number(params.roomId);
      const room = mockConsultationRooms.find(
        r => r.consultationRoomId === roomId,
      );

      if (room) {
        room.unreadCount = 0;
        console.log(`✅ MSW: 메시지 읽음 처리 성공 - Room ID: ${roomId}`);
      }

      return new HttpResponse(null, { status: 204 });
    },
  ),

  // 6. 채팅방 나가기
  http.delete(
    '/api/v1/consultation/rooms/:roomId/leave',
    ({ params, request }) => {
      const authHeader = request.headers.get('Authorization');

      if (!validateToken(authHeader)) {
        console.log(
          '❌ MSW: 인증되지 않은 사용자 - DELETE /consultation/rooms/:roomId/leave',
        );
        return HttpResponse.json(
          { message: '인증이 필요합니다.' },
          { status: 401 },
        );
      }

      const roomId = Number(params.roomId);
      const roomIndex = mockConsultationRooms.findIndex(
        r => r.consultationRoomId === roomId,
      );

      if (roomIndex !== -1) {
        mockConsultationRooms.splice(roomIndex, 1);
        console.log(`✅ MSW: 채팅방 나가기 성공 - Room ID: ${roomId}`);
      }

      return new HttpResponse(null, { status: 204 });
    },
  ),

  // 7. 상담 상태 변경
  http.patch(
    '/api/v1/consultation/rooms/:id/status',
    async ({ params, request }) => {
      const authHeader = request.headers.get('Authorization');

      if (!validateToken(authHeader)) {
        console.log(
          '❌ MSW: 인증되지 않은 사용자 - PATCH /consultation/rooms/:id/status',
        );
        return HttpResponse.json(
          { message: '인증이 필요합니다.' },
          { status: 401 },
        );
      }

      try {
        const { newStatus } = (await request.json()) as {
          userId: number;
          newStatus: string;
        };

        const roomId = Number(params.id);
        console.log(
          `✅ MSW: 상담 상태 변경 성공 - Room ID: ${roomId}, Status: ${newStatus}`,
        );

        return new HttpResponse(null, { status: 204 });
      } catch (error) {
        console.error('❌ MSW: 상담 상태 변경 중 오류:', error);
        return HttpResponse.json(
          { message: '잘못된 요청 형식입니다.' },
          { status: 400 },
        );
      }
    },
  ),

  // 8. 이미지 업로드
  http.post(
    '/api/v1/consultation/:consultationRoomId/image',
    async ({ request }) => {
      const authHeader = request.headers.get('Authorization');

      if (!validateToken(authHeader)) {
        console.log(
          '❌ MSW: 인증되지 않은 사용자 - POST /consultation/:consultationRoomId/image',
        );
        return HttpResponse.json(
          { message: '인증이 필요합니다.' },
          { status: 401 },
        );
      }

      try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
          return HttpResponse.json(
            { message: '이미지 파일이 필요합니다.' },
            { status: 400 },
          );
        }

        // 파일 크기 검증 (10MB 제한)
        if (file.size > 10 * 1024 * 1024) {
          return HttpResponse.json(
            { message: '파일 크기는 10MB 이하여야 합니다.' },
            { status: 400 },
          );
        }

        // 파일 형식 검증
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
          return HttpResponse.json(
            { message: '지원하지 않는 파일 형식입니다. (JPEG, PNG만 허용)' },
            { status: 400 },
          );
        }

        // 가상의 이미지 URL 생성
        const imageUrl = `https://cdn.moneybuddy.com/chat/${Date.now()}_${file.name}`;

        console.log('✅ MSW: 채팅 이미지 업로드 성공:', imageUrl);

        return HttpResponse.json({
          imageUrl: imageUrl,
          message: '이미지가 성공적으로 업로드되었습니다.',
        });
      } catch (error) {
        console.error('❌ MSW: 채팅 이미지 업로드 중 오류:', error);
        return HttpResponse.json(
          { message: '이미지 업로드에 실패했습니다.' },
          { status: 500 },
        );
      }
    },
  ),
];
