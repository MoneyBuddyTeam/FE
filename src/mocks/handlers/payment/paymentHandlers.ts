import { http, HttpResponse } from 'msw';
import type { PaymentRequest } from '../../../services/payment/paymentApi';

export const paymentHandlers = [
  // 결제 준비 API
  http.post('/api/v1/payments/prepare', async ({ request }) => {
    const paymentData = await request.json();
    console.log('💳 결제 준비 요청:', paymentData);
    return HttpResponse.json({
      payment_id: 'pay_' + Date.now(),
      status: 'pending',
      amount: (paymentData as PaymentRequest).amount,
      message: '결제가 준비되었습니다.',
      redirect_url: 'https://pg.example.com/payment',
    });
  }),

  // 결제 내역 조회 API - 명세서: GET /api/v1/payments/history
  http.get('/api/v1/payments/history', () => {
    console.log('📋 결제 내역 조회 요청');

    return HttpResponse.json({
      payments: [
        {
          id: 'pay_001',
          expert_name: '김전문가',
          amount: 50000,
          status: 'completed',
          payment_date: '2024-01-15T10:30:00Z',
          consultation_date: '2024-01-20T14:00:00Z',
        },
        {
          id: 'pay_002',
          expert_name: '이전문가',
          amount: 45000,
          status: 'completed',
          payment_date: '2024-01-10T15:20:00Z',
          consultation_date: '2024-01-18T16:00:00Z',
        },
      ],
      total_count: 2,
    });
  }),
  // 결제 상태 조회 API
  http.get('/api/v1/payments/:paymentId/status', ({ params }) => {
    const { paymentId } = params;
    console.log('🔍 결제 상태 조회:', paymentId);

    return HttpResponse.json({
      payment_id: paymentId,
      status: 'completed',
      amount: 50000,
      expert_name: '김전문가',
      payment_date: '2024-01-15T10:30:00Z',
      consultation_date: '2024-01-20T14:00:00Z',
    });
  }),

  // 결제 취소 API - 명세서: POST /api/v1/payments/{paymentId}/cancel
  http.post(
    '/api/v1/payments/:paymentId/cancel',
    async ({ params, request }) => {
      const { paymentId } = params;
      const body = await request.json();
      console.log('❌ 결제 취소 요청:', paymentId, body);

      return HttpResponse.json({
        message: '결제가 성공적으로 취소되었습니다.',
        refund_amount: 50000,
        refund_status: 'processing',
      });
    },
  ),
];
