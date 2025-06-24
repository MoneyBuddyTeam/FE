// C:\project\FE\src\components\pages\ExpertDetail\components\tabs\review\ReviewList.tsx

import ReviewItem from './ReviewItem';

export default function ReviewList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, idx) => (
        <ReviewItem key={idx} />
      ))}
      <button className="w-full border border-gray-200 rounded py-4 text-sm font-semibold bg-white">
        더보기
      </button>
    </div>
  );
}
