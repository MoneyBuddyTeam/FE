import { http, HttpResponse } from 'msw';
import type { ConsultationMessage } from '../../../types';

let mockMessages: ConsultationMessage[] = [];

export const chatHandlers = [
  // ✅ 메시지 목록 조회
  http.get(
    '/api/v1/consultation/rooms/:roomId/messages',
    ({ params, request }) => {
      const roomId = Number(params.roomId);
      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page') || 0);
      const size = Number(url.searchParams.get('size') || 20);

      const allMessages = mockMessages.filter(
        msg => msg.consultationRoomId === roomId,
      );
      const start = page * size;
      const end = start + size;
      const pageMessages = allMessages.slice(start, end);

      return HttpResponse.json({
        content: pageMessages,
        last: end >= allMessages.length,
      });
    },
  ),

  // ✅ 텍스트 메시지 전송
  http.post('/api/v1/consultation/messages/text', async ({ request }) => {
    const body = (await request.json()) as {
      consultationRoomId: number;
      senderId: number;
      senderNickname: string;
      message: string;
      sentAt?: string;
      replyTo?: number | null;
    };

    const newMessage: ConsultationMessage = {
      consultationRoomId: body.consultationRoomId,
      senderId: body.senderId,
      senderNickname: body.senderNickname,
      message: body.message,
      type: 'TEXT',
      imageUrl: null,
      sentAt: body.sentAt || new Date().toISOString(),
      isReadByReceiver: false,
      messageId: Date.now(),
      replyToMessage: undefined, // 필요 시 구현
    };

    mockMessages.push(newMessage);

    return HttpResponse.json({ success: true });
  }),

  // ✅ 이미지 메시지 전송
  http.post('/api/v1/consultation/messages/image', async ({ request }) => {
    const formData = await request.formData();

    const newMessage: ConsultationMessage = {
      consultationRoomId: Number(formData.get('roomId')),
      senderId: Number(formData.get('senderId')),
      senderNickname: String(formData.get('senderNickname')),
      message: String(formData.get('content') || ''),
      type: 'IMAGE',
      imageUrl: 'https://via.placeholder.com/150',
      sentAt: new Date().toISOString(),
      isReadByReceiver: false,
      messageId: Date.now(),
      replyToMessage: undefined,
    };

    mockMessages.push(newMessage);

    return HttpResponse.json({ success: true });
  }),

  // ✅ 읽음 처리
  http.patch('/api/v1/consultation/rooms/:roomId/read', async ({ request }) => {
    const body = (await request.json()) as { messageId: number };

    mockMessages = mockMessages.map(msg =>
      msg.messageId <= body.messageId
        ? { ...msg, isReadByReceiver: true }
        : msg,
    );

    return HttpResponse.json({ success: true });
  }),

  // ✅ 채팅방 상세 조회
  http.get('/api/v1/chat-rooms/:id', ({ params }) => {
    const roomId = Number(params.id);
    return HttpResponse.json({
      id: roomId,
      advisorId: 1,
      name: '모의 채팅방',
    });
  }),

  // ✅ 전문가 상세 정보 조회
  http.get('/api/v1/advisors/:id', ({ params }) => {
    const advisorId = Number(params.id);

    return HttpResponse.json({
      id: advisorId,
      name: '김소비', // 실명 또는 별명
      profileImageUrl: 'https://via.placeholder.com/80',
      bio: '재무 상담 전문가입니다.',
    });
  }),
];
