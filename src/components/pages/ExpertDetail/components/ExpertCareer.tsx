// C:\project\FE\src\components\pages\ExpertDetail\components\ExpertCareer.tsx

import type { Expert } from '../../../../types/expert';

interface ExpertCareerProps {
  expert: Expert & {
    education?: string[];
    career?: string[];
  };
}

export default function ExpertCareer({ expert }: ExpertCareerProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-base mb-2.5">경력 및 약력</h3>
      <div className="text-sm text-gray-600 mb-3">
        {(expert.education || ['서울대학교 경영학과', 'CFA Level 3']).map(
          (edu: string, idx: number) => (
            <p key={`edu-${idx}`}>{edu}</p>
          ),
        )}
      </div>
      <div className="text-sm text-gray-600">
        {(expert.career || ['금융투자협회 10년', '재무상담사 5년']).map(
          (career: string, idx: number) => (
            <p key={`career-${idx}`}>{career}</p>
          ),
        )}
      </div>
    </div>
  );
}
