import { ChevronRight } from 'lucide-react';

const reviews = [
  {
    id: 1,
    text: '주린이였는데 세부적인 계획을 세울 수 있었습니다. 그리고...',
    time: '방금 전',
  },
  {
    id: 2,
    text: '하고 싶은게 많은 사회 초년생이라 어떻게 자산 관리를 해야...',
    time: '10분 전',
  },
  {
    id: 3,
    text: '아직 연봉이 낮은 사회 초년생이다보니 어떻게 목돈을 만들...',
    time: '30분 전',
  },
];

export default function RecentReviewList() {
  return (
    <div className="my-6 px-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-h3 font-semibold">지금 올라온 상담 후기</h2>
        <button className="flex items-center text-sm text-gray-500">
          더보기 <ChevronRight size={14} className="ml-1" />
        </button>
      </div>

      <ul className="space-y-2">
        {reviews.map(review => (
          <li
            key={review.id}
            className="bg-white rounded-lg px-4 py-2 flex justify-between items-center shadow-sm text-sm text-gray-800"
          >
            <span className="truncate w-[85%]">{review.text}</span>
            <span className="whitespace-nowrap text-xs text-gray-500">
              {review.time}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
