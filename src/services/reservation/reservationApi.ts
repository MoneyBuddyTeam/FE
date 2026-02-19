import { axiosInstance } from '../api';
import { API_ENDPOINTS } from '../../config/api';

// 예약 생성 요청 타입
export interface CreateReservationRequest {
  advisor_id: number;
  category_id: number;
  title?: string;
}

// 예약 응답 타입
export interface ReservationResponse {
  id: number;
  expertId: number;
  expertName: string;
  date: string;
  time: string;
  status: string;
  consultationType: string;
  request?: string;
  amount: number;
  paymentMethod: string;
}

// 예약 생성 API (상담 채팅방 생성으로 통합) - 명세서: POST /api/v1/consultation/rooms
export const createReservationApi = async (
  reservationData: CreateReservationRequest,
) => {
  console.log('📅 API 호출: 예약 생성 (상담 채팅방 생성으로 통합)');

  // 예약 데이터를 상담 채팅방 형식으로 변환
  const consultationData = {
    consultantId: reservationData.advisor_id,
    topic: reservationData.title || '재무 상담',
    durationMinutes: 30, // 기본 30분
    amount: 50000, // 기본 금액
    paymentMethod: 'CARD', // 기본 결제 방법
  };

  const response = await axiosInstance.post(
    API_ENDPOINTS.consultations, // /api/v1/consultation/rooms
    consultationData,
  );
  console.log('✅ API 응답: 상담 채팅방 생성 성공');
  return response.data;
};

// 예약 목록 조회 API (프로젝트에서 사용하는 경로)
export const getReservationsApi = async () => {
  console.log('📋 API 호출: 예약 목록 조회');
  const response = await axiosInstance.get(API_ENDPOINTS.reservations);
  console.log('✅ API 응답: 예약 목록 조회 성공');
  return response.data;
};

// 예약 상세 조회 API (프로젝트에서 사용하는 경로)
export const getReservationDetailApi = async (reservationId: number) => {
  console.log(`🔍 API 호출: 예약 상세 조회 - ID: ${reservationId}`);
  const response = await axiosInstance.get(
    API_ENDPOINTS.reservationDetail(reservationId),
  );
  console.log(`✅ API 응답: 예약 상세 조회 성공`);
  return response.data;
};

// 예약 취소 API (프로젝트에서 사용하는 경로)
export const cancelReservationApi = async (reservationId: number) => {
  console.log(`❌ API 호출: 예약 취소 - ID: ${reservationId}`);
  const response = await axiosInstance.patch(
    API_ENDPOINTS.reservationCancel(reservationId),
  );
  console.log(`✅ API 응답: 예약 취소 성공`);
  return response.data;
};
