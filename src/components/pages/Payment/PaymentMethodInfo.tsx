// 결제 수단 타입
type PaymentMethodType = 'card' | 'npay' | 'kakaopay' | 'payco' | 'tosspay';

interface PaymentMethodInfoProps {
  selectedMethod: PaymentMethodType;
  setSelectedMethod: (method: PaymentMethodType) => void;
}

export default function PaymentMethodInfo({
  selectedMethod,
  setSelectedMethod,
}: PaymentMethodInfoProps) {
  // 일반 결제 수단
  const generalMethods = [
    {
      id: 'card' as const,
      name: '신용카드',
      icon: '💳',
    },
    {
      id: 'account' as const,
      name: '계좌이체',
      icon: '🏦',
    },
  ];

  // 간편 결제 수단

  return (
    <div className="flex flex-col items-start py-[24px] gap-[14px] w-[390px] h-[327px]">
      {/* 결제 수단 타이틀 */}
      <h2 className="w-[350px] h-[20px] font-semibold text-[16px] leading-[20px] tracking-[-0.025em] text-[#111111]">
        결제수단
      </h2>

      {/* 일반 결제 서브타이틀 */}
      <h3 className="w-[350px] h-[20px] font-semibold text-[14px] leading-[20px] tracking-[-0.025em] text-[#111111]">
        일반 결제
      </h3>

      {/* 일반 결제 버튼 영역 */}
      <div className="flex flex-row items-start p-0 gap-[12px] w-[350px] h-[46px]">
        {generalMethods.map(method => (
          <button
            key={method.id}
            type="button"
            onClick={() => setSelectedMethod(method.id as PaymentMethodType)}
            className={`box-border flex flex-row justify-center items-center py-[14px] px-[22px] gap-[10px] w-[169px] h-[46px] bg-white border ${
              selectedMethod === method.id
                ? 'border-[#6488FF] text-[#6488FF]'
                : 'border-[#F1F1F1] text-[#111111]'
            } rounded-[4px]`}
          >
            <span className="h-[16px] font-semibold text-[14px] leading-[16px] text-center tracking-[-0.025em]">
              {method.name}
            </span>
          </button>
        ))}
      </div>

      {/* 구분선 */}
      <div className="w-[350px] h-[1px] bg-[#F1F1F1]"></div>

      {/* 간편 결제 서브타이틀 */}
      <h3 className="w-[350px] h-[20px] font-semibold text-[14px] leading-[20px] tracking-[-0.025em] text-[#111111]">
        간편 결제
      </h3>

      {/* 간편 결제 영역 */}
      <div className="flex flex-col items-start p-0 gap-[10px] w-[350px]">
        {/* 첫 번째 행 */}
        <div className="flex flex-row items-start p-0 gap-[12px] w-[350px] h-[46px]">
          <div className="relative w-[169px] h-[46px]">
            <button
              type="button"
              onClick={() => setSelectedMethod('npay')}
              className={`absolute top-0 left-0 box-border flex flex-row justify-center items-center py-[14px] px-[22px] gap-[10px] w-[169px] h-[46px] bg-white border ${
                selectedMethod === 'npay'
                  ? 'border-[#6488FF] text-[#6488FF]'
                  : 'border-[#F1F1F1] text-[#111111]'
              } rounded-[4px]`}
            >
              <span className="text-center">
                {/* 실제 환경에서는 이미지 사용 */}
                네이버페이
              </span>
            </button>
          </div>

          <div className="relative w-[169px] h-[46px]">
            <button
              type="button"
              onClick={() => setSelectedMethod('kakaopay')}
              className={`absolute top-0 left-0 box-border flex flex-row justify-center items-center py-[14px] px-[22px] gap-[10px] w-[169px] h-[46px] bg-white border ${
                selectedMethod === 'kakaopay'
                  ? 'border-[#6488FF] text-[#6488FF]'
                  : 'border-[#F1F1F1] text-[#111111]'
              } rounded-[4px]`}
            >
              <span className="text-center">
                {/* 실제 환경에서는 이미지 사용 */}
                카카오페이
              </span>
            </button>
          </div>
        </div>

        {/* 두 번째 행 */}
        <div className="flex flex-row items-start p-0 gap-[12px] w-[350px] h-[46px]">
          <div className="relative w-[169px] h-[46px]">
            <button
              type="button"
              onClick={() => setSelectedMethod('payco')}
              className={`absolute top-0 left-0 box-border flex flex-row justify-center items-center py-[14px] px-[22px] gap-[10px] w-[169px] h-[46px] bg-white border ${
                selectedMethod === 'payco'
                  ? 'border-[#6488FF] text-[#6488FF]'
                  : 'border-[#F1F1F1] text-[#111111]'
              } rounded-[4px]`}
            >
              <span className="text-center">
                {/* 실제 환경에서는 이미지 사용 */}
                페이코
              </span>
            </button>
          </div>

          <div className="relative w-[169px] h-[46px]">
            <button
              type="button"
              onClick={() => setSelectedMethod('tosspay')}
              className={`absolute top-0 left-0 box-border flex flex-row justify-center items-center py-[14px] px-[22px] gap-[10px] w-[169px] h-[46px] bg-white border ${
                selectedMethod === 'tosspay'
                  ? 'border-[#6488FF] text-[#6488FF]'
                  : 'border-[#F1F1F1] text-[#111111]'
              } rounded-[4px]`}
            >
              <span className="text-center">
                {/* 실제 환경에서는 이미지 사용 */}
                토스페이
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
