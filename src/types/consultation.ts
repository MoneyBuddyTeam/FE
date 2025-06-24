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
