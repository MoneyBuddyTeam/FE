import { useNavigate, useLocation } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import PageHeader from '../../components/layout/PageHeader';

interface PaymentSuccessState {
  expertId?: string;
  expertName?: string;
  price?: number;
  date?: string;
  time?: string;
}

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PaymentSuccessState | undefined;

  const handleGoToReservationDetail = () => {
    // 예약 상세 페이지로 이동 (expertId가 있으면 해당 ID를 포함)
    if (state?.expertId) {
      navigate(`/consultation/detail/${state.expertId}`);
    } else {
      // expertId가 없으면 예약 목록 페이지로 이동
      navigate('/consultation/history');
    }
  };
  // state 데이터가 없을 경우에도 결제 성공 화면 표시
  const expertName = state?.expertName || '전문가';
  const price = state?.price || 0;
  const date = state?.date || '';
  const time = state?.time || '';

  return (
    <PageWrapper>
      <PageHeader showBackButton={false} />
      <div className="flex flex-col items-center justify-center px-5 py-12">
        <img
          src="../../../public/jpg/icon/paymentsuccess.png"
          className="w-24 h-24 text-primary mb-6"
        />
        <h1 className="text-2xl font-bold mb-2 text-center">결제 완료</h1>
        <p className="text-gray-600 text-center mb-8">
          상담 결제가 완료되었습니다.
          <br />
          상담 내역은 예약 내역에서 확인하실 수 있습니다.
        </p>

        {/* state가 없어도 최소한의 정보를 표시 */}
        <div className="bg-gray-50 w-full p-5 rounded-lg mb-8">
          <div className="flex justify-between mb-3">
            <span className="text-gray-600">전문가</span>
            <span className="font-medium">{expertName}</span>
          </div>

          {(date || time) && (
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">상담 일시</span>
              <span className="font-medium">
                {date} {time}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600">결제 금액</span>
            <span className="font-medium text-primary">
              {price.toLocaleString()}원
            </span>
          </div>
        </div>

        <div className="w-full">
          <button
            onClick={handleGoToReservationDetail}
            className="w-full bg-primary text-white py-3 rounded-md text-center"
          >
            확인
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
