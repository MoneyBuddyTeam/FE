// C:\project\FE\src\components\pages\ExpertDetail\components\tabs\review\ReviewItem.tsx

import { Star } from 'lucide-react';

export default function ReviewItem() {
  return (
    <div className="py-3">
      <div
        className="inline-block px-1 py-0.5 rounded bg-opacity-10 mb-2"
        style={{ backgroundColor: `${'#BC64FF'}10` }}
      >
        <span className="text-xs font-semibold" style={{ color: '#BC64FF' }}>
          강의
        </span>
      </div>
      <h4 className="font-semibold text-sm mb-2">
        여기에 후기에 대한 리뷰 제목이 있을 것
      </h4>
      <div className="flex items-center mb-2">
        <div className="flex">
          {[1, 2, 3, 4].map(star => (
            <Star
              key={star}
              size={12}
              className="fill-[#FF7497] text-[#FF7497]"
            />
          ))}
          <Star size={12} className="text-gray-200" />
        </div>
        <span className="text-xs text-gray-500 ml-1">4.0</span>
        <span className="text-xs text-gray-500 mx-1">|</span>
        <span className="text-xs text-gray-500">어떤 강의를 들었는지</span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">
        후기에 대한 어쩌구 저쩌구를 일단 여기에 입력을 할 것 / 후기에 대한
        어쩌구 저쩌구를 일단 여기에 입력을 할 것 / 후기에 대한 어쩌구 저쩌구를
        일단 여기에 입력을 할 것, 단 최대 글자 입력은 제한을 해야할듯..!
      </p>
    </div>
  );
}
