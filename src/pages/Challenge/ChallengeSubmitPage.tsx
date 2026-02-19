import { useParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import ChallengeSubmitForm from '../../components/pages/Challenge/ChallengeSubmitForm';
import { useChallengeStore } from '../../stores/useChallengeStore';

export default function ChallengeSubmitPage() {
  const { challengeId, missionId } = useParams<{
    challengeId: string;
    missionId: string;
  }>();

  const checklistTitle = useChallengeStore(state => state.checklistTitle);

  return (
    <PageWrapper>
      <PageHeader title="챌린지 인증" />
      <ChallengeSubmitForm
        checklistTitle={checklistTitle}
        challengeId={challengeId}
        missionId={Number(missionId)}
      />
    </PageWrapper>
  );
}
