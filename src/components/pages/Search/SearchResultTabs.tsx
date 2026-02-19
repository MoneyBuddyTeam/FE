interface Props {
  counts: {
    total: number;
    experts: number;
    lectures: number;
    megazines: number;
    community?: number;
  };
  activeTab: 'total' | 'experts' | 'lectures' | 'megazines' | 'community';
  onTabChange: (
    key: 'total' | 'experts' | 'lectures' | 'megazines' | 'community',
  ) => void;
}

export default function SearchResultTabs({
  counts,
  activeTab,
  onTabChange,
}: Props) {
  const tabs: {
    key: 'total' | 'experts' | 'lectures' | 'megazines' | 'community';
    label: string;
    count: number;
  }[] = [
    { key: 'total', label: '전체', count: counts.total },
    { key: 'experts', label: '엑스퍼트', count: counts.experts },
    { key: 'lectures', label: '강의', count: counts.lectures },
    { key: 'megazines', label: '매거진', count: counts.megazines },
    { key: 'community', label: '커뮤니티', count: counts.community ?? 0 },
  ];

  return (
    <div className="flex gap-4 mt-4 text-sm font-medium border-b border-gray-200">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`relative pb-2 ${
            activeTab === tab.key ? 'text-black font-semibold' : 'text-[#666]'
          }`}
        >
          {tab.label}({tab.count})
          {activeTab === tab.key && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6488FF] rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
