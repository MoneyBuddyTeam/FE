import { useEffect, useState, useRef, type ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import PageHeader from '../../components/layout/PageHeader';
import { useExpert } from '../../hooks/useExpert';
import { formatPhoneNumber } from '../../utils/formatters';
import PaymentExpertInfo from '../../components/pages/Payment/PaymentExpertInfo';
import PaymentContactInfo from '../../components/pages/Payment/PaymentContactInfo';
import PaymentRequestInfo from '../../components/pages/Payment/PaymentRequestInfo';
import PaymentPointInfo from '../../components/pages/Payment/PaymentPointInfo';
import PaymentPriceInfo from '../../components/pages/Payment/PaymentPriceInfo';
import PaymentMethodInfo from '../../components/pages/Payment/PaymentMethodInfo';
import { useProcessPayment } from '../../hooks/usePayment';

import { useReservationStore } from '../../stores/useReservationStore';

// 결제 타입 정의
type PaymentMethodType = 'card' | 'npay' | 'kakaopay' | 'payco' | 'tosspay';

// 스크롤 컨테이너 컴포넌트 추출
const ScrollContainer = ({
  children,
  title = '결제하기',
}: {
  children: ReactNode;
  title?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="h-[844px] overflow-y-scroll select-none"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
        scrollbarColor: 'transparent transparent',
      }}
    >
      <div className="sticky top-0 bg-white z-20">
        <PageHeader title={title} showBackButton />
      </div>
      {children}
    </div>
  );
};

export default function PaymentPage() {
  const navigate = useNavigate();
  const { expertId } = useParams();
  const {
    expert: storeExpert,
    selectedDate,
    selectedTime,
  } = useReservationStore();
  const { data: expertData, isLoading: expertLoading } = useExpert(
    expertId ? parseInt(expertId) : undefined,
  );
  const processPaymentMutation = useProcessPayment();

  // expert 정보는 store에서 먼저 가져오고, 없으면 API에서 가져옴
  const expert = storeExpert || expertData;
  // 상태 관리
  const [phone, setPhone] = useState<string>('');
  const [isSameAsUser, setIsSameAsUser] = useState<boolean>(false);
  const [request, setRequest] = useState<string>('');
  const [usedPoint, setUsedPoint] = useState<number>(0);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 결제 수단 상태
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethodType>('card');

  // 포인트 관련 정보
  const availablePoint = 2000; // 실제로는 API에서 가져옴
  const hasAvailablePoints = availablePoint > 0;

  // 초기 사용자 정보 로드
  useEffect(() => {
    setPhone(formatPhoneNumber('01012345678'));
  }, []);

  // 상담 가격, 포인트 차감 후 최종 결제 금액 계산
  const price = expert?.price || 30000;
  const totalPrice = Math.max(0, price - usedPoint);

  // 결제 처리 함수
  const handlePayment = async () => {
    if (!selectedMethod) {
      alert('결제 수단을 선택해주세요.');
      return;
    }

    try {
      setIsLoading(true);

      const paymentData = {
        expert_id: expert?.id,
        amount: totalPrice,
        payment_method: selectedMethod,
        used_point: usedPoint,
        phone: phone,
        request: request,
      };

      const result = await processPaymentMutation.mutateAsync(paymentData);

      // 결제 성공 시 성공 페이지로 이동
      navigate('/payment/success', {
        state: {
          expertId: expert?.id,
          expertName: expert?.nickname,
          price: totalPrice,
          date: selectedDate,
          time: selectedTime,
          paymentId: result.payment_id,
        },
      });
    } catch (error) {
      console.error('결제 실패:', error);
      navigate('/payment/fail', {
        state: {
          errorMessage: '결제 처리 중 오류가 발생했습니다.',
          expertId: expert?.id,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading || expertLoading) {
    return (
      <PageWrapper>
        <div className="flex justify-center items-center h-[600px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </PageWrapper>
    );
  }
  if (!expert && !expertLoading) {
    return (
      <PageWrapper>
        <div className="p-5 text-center">
          <p>전문가 정보를 불러오는데 문제가 발생했습니다.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </PageWrapper>
    );
  }

  // 하단에 고정될 버튼 컴포넌트
  const BottomButton = (
    <div className="bg-white border-t border-gray-200 p-4 w-full">
      {' '}
      <button
        onClick={handlePayment}
        disabled={!isAgreed || isLoading}
        className={
          isAgreed && !isLoading
            ? 'w-full bg-primary text-white py-3 rounded-md text-center'
            : 'w-full bg-gray-300 text-white py-3 rounded-md text-center'
        }
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
            처리 중...
          </span>
        ) : (
          `${totalPrice.toLocaleString()}원 결제하기`
        )}
      </button>
    </div>
  );

  return (
    <PageWrapper bottomElement={BottomButton}>
      <ScrollContainer title="결제하기">
        <div className="w-[390px] mx-auto bg-white pb-24">
          {/* 경고 메시지 영역 */}
          <div className="flex flex-col gap-2 p-3 bg-gray-100">
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <span>⚠️</span>
              <p>
                예약 당일은 예약을 변경/취소 할 수 없으며, 노쇼 시 환불이
                불가합니다.
              </p>
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <span>⚠️</span>
              <p>
                예약 시간에 늦을 경우, 경과한 시간만큼 이용 시간이 줄어듭니다.
              </p>
            </div>
          </div>

          <div className="p-5">
            {' '}
            {/* 전문가 정보 */}
            {expert && (
              <PaymentExpertInfo
                expert={expert}
                consultationDate={selectedDate || ''}
                consultationTime={selectedTime || ''}
              />
            )}
            {/* 연락처 정보 */}
            <PaymentContactInfo
              phone={phone}
              setPhone={setPhone}
              isSameAsUser={isSameAsUser}
              setIsSameAsUser={setIsSameAsUser}
            />
            {/* 요청사항 */}
            <PaymentRequestInfo request={request} setRequest={setRequest} />
            {/* 포인트 사용 - 포인트가 있을 때만 표시 */}
            {hasAvailablePoints && (
              <PaymentPointInfo
                availablePoint={availablePoint}
                usedPoint={usedPoint}
                setUsedPoint={setUsedPoint}
              />
            )}
            {/* 결제 금액 */}
            <PaymentPriceInfo
              price={price}
              usedPoint={usedPoint}
              totalPrice={totalPrice}
            />
            {/* 결제수단 */}
            <PaymentMethodInfo
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
            />
            <div>
              <div className="flex items-center gap-[7px]">
                <input
                  type="checkbox"
                  id="agree"
                  checked={isAgreed}
                  onChange={e => setIsAgreed(e.target.checked)}
                  className="custom-checkbox"
                />
                {/* 법적 고지 */}
                <label
                  htmlFor="agree"
                  className="text-[12px] text-[#777777] cursor-pointer"
                >
                  결제 진행 시 결제 동의 및 필수 약관에 동의한 것으로
                  간주됩니다.
                </label>
              </div>
            </div>
          </div>
        </div>
      </ScrollContainer>
    </PageWrapper>
  );
}
