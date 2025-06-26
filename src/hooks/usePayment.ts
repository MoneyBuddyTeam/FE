import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  preparePaymentApi,
  getPaymentHistoryApi,
  getPaymentStatusApi,
  cancelPaymentApi,
} from '../services/payment/paymentApi';

// 결제 처리
export const useProcessPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: preparePaymentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};

// 결제 상태 조회
export const usePaymentStatus = (paymentId: string | undefined) => {
  return useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => (paymentId ? getPaymentStatusApi(paymentId) : null),
    enabled: !!paymentId,
  });
};

// 결제 취소
export const useCancelPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentId,
      reason,
    }: {
      paymentId: string;
      reason: string;
    }) => cancelPaymentApi(paymentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};

// 결제 내역 조회
export const usePaymentHistory = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: getPaymentHistoryApi,
  });
};
