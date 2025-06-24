// C:\project\FE\src\components\pages\ExpertDetail\components\ExpertIntroduction.tsx

import type { Expert } from '../../../../types/expert';

interface ExpertIntroductionProps {
  expert: Expert;
}

export default function ExpertIntroduction({
  expert,
}: ExpertIntroductionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
      <h3 className="font-semibold text-base mb-2.5">엑스퍼트 소개</h3>
      <p className="text-sm text-gray-600">
        {expert.description ||
          '"금융은 누구에게나 쉽게 다가올 수 있어야 합니다. 저는 복잡한 개념을 간단히 풀어내고, 실질적인 사례를 통해 금융에 자신감을 가지게 도와드리겠습니다."'}
      </p>
    </div>
  );
}
