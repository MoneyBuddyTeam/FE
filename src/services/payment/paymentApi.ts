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
  payment_id: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  message: string;
  redirect_url?: string;
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

// 결제 준비 API
export const preparePaymentApi = async (
  paymentData: PaymentRequest,
): Promise<PaymentResponse> => {
  console.log('💳 API 호출: 결제 준비');
  try {
    const response = await axiosInstance.post(
      '/api/v1/payments/prepare',
      paymentData,
    );
    console.log('✅ 결제 준비 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 결제 준비 실패:', error);
    throw error;
  }
};

// 결제 승인 API
export const approvePaymentApi = async (paymentId: string, pgToken: string) => {
  const response = await axiosInstance.post('/api/v1/payments/approve', {
    paymentId,
    pgToken,
  });
  return response.data;
};

// 결제 내역 조회 API
export const getPaymentHistoryApi = async () => {
  const response = await axiosInstance.get('/api/v1/payments/history');
  return response.data;
};

// 결제 취소 API
export const cancelPaymentApi = async (paymentId: string, reason: string) => {
  const response = await axiosInstance.post(
    `/api/v1/payments/${paymentId}/cancel`,
    {
      reason,
    },
  );
  return response.data;
};

// 결제 상태 조회 API (임시 - 명세서에 추가 필요)
export const getPaymentStatusApi = async (
  paymentId: string,
): Promise<PaymentStatus> => {
  console.log('💳 API 호출: 결제 상태 조회 (임시 API)');
  const response = await axiosInstance.get(
    `/api/v1/payments/${paymentId}/status`,
  );
  return response.data;
};
