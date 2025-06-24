import { useNavigate, useLocation } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import PageHeader from '../../components/layout/PageHeader';

interface PaymentFailState {
  errorMessage?: string;
  expertId?: string;
}

export default function PaymentFailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PaymentFailState | undefined;

  const handleRetry = () => {
    // 이전 결제 페이지로 돌아가기
    if (state?.expertId) {
      navigate(`/payment/${state.expertId}`);
    } else {
      // state가 없는 경우 기본 결제 페이지로 이동하거나 뒤로 가기
      navigate(-1); // 이전 페이지로 이동
    }
  };

  // 필요한 데이터가 없을 경우에도 기본 실패 화면 표시
  const errorMessage = state?.errorMessage || '결제 중 오류가 발생했습니다.';

  return (
    <PageWrapper>
      <PageHeader showBackButton={false} />
      <div className="flex flex-col items-center justify-center px-5 py-12">
        <img
          src="../../../public/jpg/icon/paymentfail.png"
          className="w-24 h-24 text-red-500 mb-6"
        />
        <h1 className="text-2xl font-bold mb-2">결제 실패</h1>
        <p className="text-gray-600 text-center mb-8">
          {errorMessage}
          <br />
          다시 시도해주세요.
        </p>

        <div className="w-full">
          <button
            onClick={handleRetry}
            className="w-full bg-primary text-white py-3 rounded-md text-center"
          >
            확인
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
