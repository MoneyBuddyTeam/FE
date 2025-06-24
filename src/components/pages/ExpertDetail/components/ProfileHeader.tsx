// C:\project\FE\src\components\pages\ExpertDetail\components\ProfileHeader.tsx

import type { Expert } from '../../../../types/expert';

interface ProfileHeaderProps {
  expert: Expert;
}

export default function ProfileHeader({ expert }: ProfileHeaderProps) {
  return (
    <div className="relative w-full h-[320px]">
      <img
        src={expert.profile_image}
        alt={expert.nickname}
        className="w-full h-full object-cover"
      />
      <div className="absolute left-0 bottom-0 w-full h-[120px] bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-5 gap-3">
        {expert.id <= 10 && (
          <div className="flex justify-between items-center w-full">
            <div className="bg-gradient-to-r from-[#75C1FF] via-[#6488FF] to-[#BC64FF] rounded px-2 py-1">
              <span className="text-white text-sm font-semibold">
                이달의 엑스퍼트
              </span>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center w-full">
          <h1 className="text-white text-2xl font-semibold">{expert.bio}</h1>
        </div>
      </div>
    </div>
  );
}
