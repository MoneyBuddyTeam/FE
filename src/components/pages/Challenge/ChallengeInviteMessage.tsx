import { PiggyBank } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChallengeInviteMessageProps {
  message: string;
  sentAt: string;
  challengeId: number;
}

export default function ChallengeInviteMessage({
  message,
  sentAt,
  challengeId,
}: ChallengeInviteMessageProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/challenge/${challengeId}`);
  };

  return (
    <div>
      <div className="flex items-center bg-[#6488FF] max-w-[280px] text-white px-4 py-3 rounded-t-xl gap-2">
        <PiggyBank size={16} />
        <span className="text-[13px] font-semibold">
          챌린지를 수행해주세요!
        </span>
      </div>
      <div className="rounded-2xl bg-[#F2F5FF] p-4 max-w-[280px] text-sm shadow-sm">
        <div className="bg-[#F2F5FF] text-[#222] whitespace-pre-wrap px-2 py-3 leading-relaxed">
          {message}
        </div>

        <button
          onClick={handleClick}
          className="w-full mt-1 bg-[#728DA3] text-white py-2 rounded-lg text-sm font-semibold"
        >
          챌린지 수행하기
        </button>
      </div>

      <p className="text-[11px] text-gray-400 mt-2">{sentAt}</p>
    </div>
  );
}
