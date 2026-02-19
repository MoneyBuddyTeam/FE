import { type JSX, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/Button';
import ExpertCard from './ExpertCard';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { getMonthlyExperts } from '../../../services/experts/expertApi'; // 경로 확인

export default function MonthlyExpertList(): JSX.Element {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['experts', 'monthly', 0, 5],
    queryFn: () => getMonthlyExperts(0, 5),
    staleTime: 1000 * 60 * 5,
  });

  const experts = useMemo(() => data?.content ?? [], [data]);
  console.log(experts);
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

      {isLoading && (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <p className="px-4 text-sm text-red-500">목록을 불러오지 못했습니다.</p>
      )}

      {!isLoading && !error && (
        <div className="flex flex-col gap-2 px-4">
          {experts.length === 0 ? (
            <div className="text-sm text-gray-500 py-4">
              추천할 엑스퍼트가 없어요.
            </div>
          ) : (
            experts.map((item: any, idx: number) => (
              <ExpertCard
                key={item.id}
                expert={{ ...item, rank: item.rank ?? idx + 1 }}
                variant="monthly"
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
