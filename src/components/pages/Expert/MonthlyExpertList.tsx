import { useEffect, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/Button';
import ExpertCard from './ExpertCard';
import { useExpertStore } from '../../../stores/useExpertStore';
import dayjs from 'dayjs';
import ScrollContainer from 'react-indiana-drag-scroll';

export default function MonthlyExpertList(): JSX.Element {
  const navigate = useNavigate();
  const { experts, fetchExperts } = useExpertStore();

  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  const currentMonth = dayjs().format('M');
  const displayMonth = `${currentMonth}월`;

  return (
    <div>
      <div className="h-[8px] bg-[#F5F5F5] my-3 w-full" />
      <div className="flex justify-between items-center px-4 pt-4">
        <div className="text-h3 font-semibold">이 달의 엑스퍼트</div>
        <Button variant="text" onClick={() => navigate('/experts-list')}>
          더보기
        </Button>
      </div>
      <p className="text-b2 text-[#9C9C9C] px-4 mt-1 mb-3">
        {displayMonth} 가장 상담율이 높은 엑스퍼트 5명을 선정했어요.
      </p>

      <div className="flex flex-col gap-2 px-4">
        {experts.map(item => (
          <ExpertCard key={item.id} expert={item} variant="monthly" />
        ))}
      </div>
    </div>
  );
}
