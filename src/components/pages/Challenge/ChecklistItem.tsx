import { useNavigate, useParams } from 'react-router-dom';
import { useChallengeStore } from '../../../stores/useChallengeStore';

interface ChecklistItemProps {
  text: string;
  status: '완료' | '미완료' | '미완료_D-3' | '피드백중';
  missionId: number;
}

const statusColors = {
  완료: 'text-[#3B4EFF]',
  미완료: 'text-gray-400',
  '미완료_D-3': 'text-gray-400',
  피드백중: 'text-[#FF5E5E]',
};

const statusTextMap = {
  완료: '완료',
  미완료: '미완료',
  '미완료_D-3': '미완료 (D-3)',
  피드백중: '피드백중',
};

export default function ChecklistItem({
  text,
  status,
  missionId,
}: ChecklistItemProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isCompleted = status === '완료';

  const setChecklistTitle = useChallengeStore(state => state.setChecklistTitle);

  const handleClick = () => {
    if (!isCompleted && id) {
      setChecklistTitle(text);
      navigate(`/challenge/${id}/mission/${missionId}/submit`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex justify-between items-center my-3 px-4 py-3 rounded border cursor-pointer ${
        isCompleted ? 'border-[#BECCFA]' : 'border-[#F1F1F1]'
      }`}
    >
      <span className="text-sm text-black">{text}</span>
      <span className={`text-xs font-medium ${statusColors[status]}`}>
        {statusTextMap[status]}
      </span>
    </div>
  );
}
