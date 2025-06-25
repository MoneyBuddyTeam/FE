export type ConsultationStatus =
  | '예약완료'
  | '상담중'
  | '상담완료'
  | '취소중'
  | '취소완료';

export interface ConsultationHistory {
  id: number;
  expertId: number;
  expertName: string;
  field: string;
  date: string;
  time: string;
  type: string;
  status: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  consultationArea: string;
  consultationNotes: string;
  reviewStatus?: 'available' | 'completed';
  dateObject?: Date; // 정렬을 위한 날짜 객체 추가
}

export interface ConsultationListResponse {
  consultations: ConsultationHistory[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ConsultationMessage {
  messageId: number;
  consultationRoomId: number;
  senderId: number;
  senderNickname: string;
  message: string;
  type: 'TEXT' | 'IMAGE' | 'SYSTEM';
  imageUrl?: string | null;
  sentAt: string;
  isReadByReceiver: boolean;
  replyToMessage?: {
    messageId: number;
    senderNickname: string;
    message: string;
  };
}

export interface ChatMessage {
  consultationRoomId: number;
  senderId: number;
  senderNickname: string;
  type: 'TEXT' | 'IMAGE';
  message: string;
  imageUrl?: string;
  replyTo?: number | null;
  sentAt?: string;
}

// 명세서 준수 - 상담 채팅방 관련 타입들
export interface ConsultationRoom {
  consultationRoomId: number;
  topic: string;
  opponentUserId: number;
  opponentNickname: string;
  opponentProfileImage: string;
  lastMessage: string;
  lastMessageAt: string;
  isClosed: boolean;
  unreadCount: number;
}

export interface ConsultationRoomDetail {
  consultationRoomId: number;
  topic: string;
  opponentNickname: string;
  opponentProfileImage: string;
}

export interface CreateConsultationRoomRequest {
  consultantId: number;
  topic: string;
  durationMinutes: number;
  amount: number;
  paymentMethod: string;
}

export interface UpdateConsultationStatusRequest {
  userId: number;
  newStatus: 'REQUESTED' | 'SCHEDULED' | 'COMPLETED';
}

export interface ConsultationImageUploadResponse {
  imageUrl: string;
}
