import Text from '../../common/Text';
import { ChevronRight } from 'lucide-react';
import ScrollContainer from 'react-indiana-drag-scroll';
import RecommendExpertCard from './RecommendExpertCard';
import { expertData } from '../../../data/expertData';
import { useNavigate } from 'react-router-dom';
import type { JSX } from 'react';

export default function HomeExpertList(): JSX.Element {
  const navigate = useNavigate();

  const recommendedExperts = expertData
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const handleMoreClick = () => {
    navigate('/experts-list');
  };

  return (
    <div>
      <div className="flex justify-between items-center px-5 mb-[12px] mt-10">
        <Text type="H2" className="font-semibold">
          머니버디 추천 엑스퍼트
        </Text>
        <button
          onClick={handleMoreClick}
          className="flex items-center text-b3 text-[#777777]"
        >
          더보기
          <ChevronRight size={16} className="ml-[2px]" />
        </button>
      </div>

      <ScrollContainer
        className="scroll-container hide-scrollbar px-5 mb-8"
        vertical={false}
        horizontal={true}
        hideScrollbars={true}
      >
        <div className="flex gap-[10px] min-w-max">
          {recommendedExperts.map(expert => (
            <RecommendExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      </ScrollContainer>
    </div>
  );
}
