import { axiosInstance } from '../api';

export interface PaymentRequest {
  expertId: number;
  amount: number;
  method: string;
  consultationType: string;
  date: string;
  time: string;
  request?: string;
  usedPoints?: number;
}

export interface PaymentResponse {
  success: boolean;
  paymentId: string;
  transactionId: string;
  message: string;
}

export interface PaymentStatus {
  paymentId: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  method: string;
  paidAt?: string;
}

export interface PaymentHistory {
  id: string;
  expertId: number;
  expertName: string;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  date: string;
  consultationType: string;
}

// 결제 처리 API
export const processPaymentApi = async (paymentData: any) => {
  console.log('💳 API 호출: 결제 처리');
  const response = await axiosInstance.post('/api/v1/payments', paymentData);
  console.log('✅ API 응답: 결제 처리 성공');
  return response.data;
};

// 결제 상태 조회 API
export const getPaymentStatusApi = async (paymentId: string) => {
  console.log(`💳 API 호출: 결제 상태 조회 - ID: ${paymentId}`);
  const response = await axiosInstance.get(`/api/v1/payments/${paymentId}`);
  console.log('✅ API 응답: 결제 상태 조회 성공');
  return response.data;
};

// 결제 취소 API
export const cancelPaymentApi = async (paymentId: string) => {
  console.log(`💳 API 호출: 결제 취소 - ID: ${paymentId}`);
  const response = await axiosInstance.delete(`/api/v1/payments/${paymentId}`);
  console.log('✅ API 응답: 결제 취소 성공');
  return response.data;
};

// 결제 내역 조회 API
export const getPaymentHistoryApi = async () => {
  console.log('💳 API 호출: 결제 내역 조회');
  const response = await axiosInstance.get('/api/v1/payments');
  console.log('✅ API 응답: 결제 내역 조회 성공');
  return response.data;
};
