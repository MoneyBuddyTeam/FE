// C:\project\FE\src\components\pages\ExpertDetail\components\ExpertSkills.tsx

import type { Expert } from '../../../../types/expert';

interface ExpertSkillsProps {
  expert: Expert & {
    skills?: string[];
  };
}

export default function ExpertSkills({ expert }: ExpertSkillsProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
      <h3 className="font-semibold text-base mb-2.5">보유 기술 및 전문 분야</h3>
      <div className="flex flex-wrap gap-1.5">
        {(expert.skills || ['재무 설계', '투자 분석', '부채 관리']).map(
          (skill: string, index: number) => (
            <div
              key={index}
              className="border border-[#FF7497] rounded-full px-2 py-1"
            >
              <span className="text-xs text-[#FF7497] font-semibold">
                {skill}
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
