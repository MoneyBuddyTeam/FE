interface SearchTagListProps {
  onTagClick: (tag: string) => void;
}

const dummyTags = [
  '기초 금융 이해',
  '개인 자산관리',
  '금융 정책 방향성',
  '연말정산 디지털 금융 기준',
  '투자 입문',
  '부동산 기초',
  '경제 이해',
  '재무계획과 목표설정',
  '투자 심화',
  '부동산 신청',
];

export default function SearchTagList({ onTagClick }: SearchTagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {dummyTags.map(tag => (
        <button
          key={tag}
          onClick={() => onTagClick(tag)}
          className="px-3 py-1 bg-gray-100 rounded-full text-sm"
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
