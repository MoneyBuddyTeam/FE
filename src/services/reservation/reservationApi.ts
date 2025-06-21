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

// 예약 생성 API (명세서에 따라 상담 채팅방 생성으로 처리)
export const createReservationApi = async (
  reservationData: CreateReservationRequest,
) => {
  console.log('📅 API 호출: 예약 생성 (상담 채팅방 생성)');
  const response = await axiosInstance.post(
    API_ENDPOINTS.consultations,
    reservationData,
  );
  console.log('✅ API 응답: 예약 생성 성공');
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
