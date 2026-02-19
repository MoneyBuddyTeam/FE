// src/services/chat/chatApi.ts
import { axiosInstance } from '../api';
import { API_ENDPOINTS } from '../../config/api';
import type { ConsultationMessage } from '../../types';

console.log('💡 요청 주소:', API_ENDPOINTS.advisors);

// 메시지 목록 조회 (무한스크롤 지원)
export const fetchMessages = async (
  roomId: number,
  beforeId?: number,
  limit: number = 20,
): Promise<{ messages: ConsultationMessage[]; last: boolean }> => {
  const res = await axiosInstance.get(API_ENDPOINTS.chatMessages(roomId), {
    params: {
      ...(beforeId ? { before_id: beforeId } : {}),
      limit,
    },
  });

  return {
    messages: res.data.messages,
    last: res.data.messages.length < limit,
  };
};

// 메시지 읽음 처리
export const markAsRead = async ({ messageId }: { messageId: number }) => {
  await axiosInstance.patch(API_ENDPOINTS.markMessageAsRead(messageId));
};

export const getChatRoomDetailApi = async (roomId: number) => {
  const res = await axiosInstance.get(API_ENDPOINTS.chatRoomDetail(roomId));
  return res.data;
};
