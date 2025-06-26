import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import PageHeader from '../../components/layout/PageHeader';
import ProgressArc from '../../components/pages/Challenge/ProgressArc';
import ChecklistItem from '../../components/pages/Challenge/ChecklistItem';
import { getChallengeDetail } from '../../services/challenge/challengeApi';

interface ChecklistItemType {
  id: number;
  text: string;
  status: '완료' | '미완료' | '미완료_D-3' | '피드백중';
}

export default function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [checklist, setChecklist] = useState<ChecklistItemType[]>([]);
  const [deadline, setDeadline] = useState('');
  const [progress, setProgress] = useState(0);

  const fetchChecklist = async () => {
    try {
      if (!id) return;
      const numId = Number(id);
      if (isNaN(numId)) return;

      const response = await getChallengeDetail(numId);
      console.log('📦 API 응답:', response);

      const checklistItems: ChecklistItemType[] = (response.items ?? []).map(
        (item: any) => ({
          id: item.id,
          text: item.title,
          status:
            item.status === 'DONE'
              ? '완료'
              : item.status === 'PENDING'
                ? '미완료'
                : item.status === 'REVIEW'
                  ? '피드백중'
                  : '미완료',
        }),
      );

      const total = checklistItems.length;
      const done = checklistItems.filter(
        (item: ChecklistItemType) => item.status === '완료',
      ).length;
      const computedProgress = total > 0 ? Math.round((done / total) * 100) : 0;

      setChecklist(checklistItems);
      setDeadline(response.deadline ?? '2025.12.25');
      setProgress(computedProgress);
    } catch (e) {
      console.error('❌ checklist 불러오기 실패:', e);
    }
  };

  useEffect(() => {
    fetchChecklist();
  }, [id]);

  return (
    <PageWrapper>
      <PageHeader title="챌린지" />
      <div className="p-5">
        <div className="text-center">
          <div className="text-h2 text-black mb-2">
            지금 챌린지를 도전해보세요
          </div>
          <div className="text-b3 text-[#777777] mb-6">
            리스트를 보고, 엑스퍼트님께 챌린지 결과를 제출해주세요.
          </div>
        </div>

        <ProgressArc date={deadline} percent={progress} />

        <div className="mt-6 flex flex-col gap-2">
          {checklist.map(item => (
            <ChecklistItem
              key={item.id}
              text={item.text}
              status={item.status}
              missionId={item.id}
            />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
