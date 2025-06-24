// C:\project\FE\src\components\pages\ExpertDetail\components\tabs\ReviewTab.tsx

import ReviewSummary from './review/ReviewSummary';
import ReviewList from './review/ReviewList';

export default function ReviewTab() {
  return (
    <div className="bg-gray-100 pt-6 px-5">
      <h3 className="font-semibold text-lg mb-4 pl-1">후기</h3>
      <div className="bg-gray-100 mb-6">
        <ReviewSummary />
        <ReviewList />
      </div>
    </div>
  );
}
