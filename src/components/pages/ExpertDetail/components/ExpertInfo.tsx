// C:\project\FE\src\components\pages\ExpertDetail\components\ExpertInfo.tsx

import { Star } from 'lucide-react';
import { COMMA_NUMBER_FORMAT } from '../../../../utils';
import type { Expert } from '../../../../types/expert';

interface ExpertInfoProps {
  expert: Expert & {
    contact_hours?: string;
    response_time?: string;
  };
}

export default function ExpertInfo({ expert }: ExpertInfoProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <div className="flex items-center">
          <h2 className="text-2xl font-semibold mr-2">{expert.nickname}</h2>
          <div className="bg-primary bg-opacity-10 px-1.5 py-0.5 rounded text-xs text-primary font-semibold flex items-center">
            <span className="text-xs">엑스퍼트</span>
          </div>
        </div>
        <div className="flex items-center text-gray-500 text-xs mt-2">
          <span>{expert.contact_hours || '오전 10시 - 오후 10시'}</span>
          <span className="mx-1.5 w-1 h-1 bg-gray-500 rounded-full"></span>
          <span>{expert.response_time || '2시간 이내 응답'}</span>
        </div>
      </div>

      <div className="text-right">
        <div className="flex items-center justify-end mb-1">
          <Star size={14} className="text-[#FF7497] fill-[#FF7497]" />
          <span className="text-base font-semibold ml-1">{expert.rating}</span>
          <span className="text-xs text-gray-500 ml-0.5">
            ({expert.review_count})
          </span>
        </div>
        <div className="font-bold text-xl">
          {COMMA_NUMBER_FORMAT(expert.price)}원
        </div>
      </div>
    </div>
  );
}
