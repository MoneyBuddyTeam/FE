import ChallengeCard from './ChallengeCard';
import type { ChallengeData } from '../../../types/mypage.types';
import { useNavigate } from 'react-router-dom';

interface ChallengeSectionProps {
  challenges: ChallengeData[];
  onChallengeClick: (challengeId: number) => void;
}

export default function ChallengeSection({
  challenges,
}: ChallengeSectionProps) {
  const navigate = useNavigate();
  const handleChallengeClick = (challengeId: number) => {
    navigate(`/challenge/${challengeId}`);
  };

  return (
    <div className="space-y-4">
      {challenges.map(challenge => (
        <ChallengeCard
          key={challenge.id}
          title={challenge.title}
          deadline={challenge.deadline}
          percentage={challenge.progress}
          status={challenge.status}
          onClick={() => handleChallengeClick(challenge.id)}
        />
      ))}
    </div>
  );
}
