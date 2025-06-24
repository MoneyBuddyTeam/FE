import { useState, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import PageHeader from '../../components/layout/PageHeader';
import ChallengeStatusCard from '../../components/pages/Challenge/ChallengeStatusCard';

// 스크롤 컨테이너 컴포넌트
const ScrollContainer = ({
  children,
  title = '챌린지 현황',
}: {
  children: ReactNode;
  title?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="h-[844px] overflow-y-scroll select-none"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
        scrollbarColor: 'transparent transparent',
      }}
    >
      <div className="sticky top-0 bg-white z-20">
        <PageHeader title={title} showBackButton />
      </div>
      {children}
    </div>
  );
};

// 탭 컴포넌트
const TabSection = ({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => {
  const tabs = [
    { id: 'all', label: '전체' },
    { id: 'progress', label: '진행중' },
    { id: 'completed', label: '완료' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '0px',
        width: '390px',
        height: '48px',
      }}
    >
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '14px 40px',
            gap: '10px',
            width: '130px',
            height: '48px',
            borderBottom:
              activeTab === tab.id ? '2px solid #6790FF' : '1px solid #E9E9E9',
            cursor: 'pointer',
            flex: 'none',
            order: index,
            flexGrow: 1,
          }}
        >
          <span
            style={{
              fontFamily: 'Pretendard',
              fontStyle: 'normal',
              fontWeight: activeTab === tab.id ? 600 : 400,
              fontSize: '16px',
              lineHeight: '19px',
              letterSpacing: '-0.025em',
              color: '#000000',
            }}
          >
            {tab.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// 챌린지 데이터 타입
interface Challenge {
  id: number;
  title: string;
  deadline: string;
  progress: number;
  status: 'progress' | 'urgent' | 'completed' | 'expired';
  mentorName: string;
  mentorImage: string;
}

export default function ChallengeStatusPage() {
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  // 모의 챌린지 데이터 - 다양한 상태 포함
  const challenges: Challenge[] = [
    {
      id: 1,
      title: '챌린지를 수행해주세요',
      deadline: '2025.12.25 까지 (D-00)',
      progress: 20,
      status: 'progress',
      mentorName: '박재현',
      mentorImage: '/jpg/experts/expert1.png',
    },
    {
      id: 2,
      title: '곧 챌린지 마감, 지금 수행해요!',
      deadline: '2025.12.25 까지 (D-00)',
      progress: 20,
      status: 'urgent',
      mentorName: '박재현',
      mentorImage: '/jpg/experts/expert1.png',
    },
    {
      id: 3,
      title: '챌린지 완료, 축하드려요 🙌',
      deadline: '2025.12.25 까지 (D-00)',
      progress: 100,
      status: 'completed',
      mentorName: '박재현',
      mentorImage: '/jpg/experts/expert1.png',
    },
    {
      id: 4,
      title: '챌린지가 종료되었어요.',
      deadline: '2025.12.25 까지 (D-00)',
      progress: 20,
      status: 'expired',
      mentorName: '박재현',
      mentorImage: '/jpg/experts/expert1.png',
    },
  ];

  // 탭에 따른 필터링
  const filteredChallenges = challenges.filter(challenge => {
    switch (activeTab) {
      case 'progress':
        return challenge.status === 'progress' || challenge.status === 'urgent';
      case 'completed':
        return challenge.status === 'completed';
      default:
        return true;
    }
  });

  return (
    <PageWrapper>
      <ScrollContainer title="챌린지">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '0px 0px 40px',
            position: 'relative',
            width: '390px',
            background: '#FFFFFF',
          }}
        >
          {/* 탭 섹션 */}
          <TabSection activeTab={activeTab} onTabChange={setActiveTab} />
          {/* 챌린지 목록 */}{' '}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '20px 20px 24px',
              gap: '13px',
              width: '390px',
            }}
          >
            {filteredChallenges.map(challenge => (
              <ChallengeStatusCard
                key={challenge.id}
                challenge={challenge}
                onDetailClick={challengeId => {
                  // 챌린지 상세 페이지로 이동
                  navigate(`/challenge/${challengeId}`);
                }}
              />
            ))}
          </div>
        </div>
      </ScrollContainer>
    </PageWrapper>
  );
}
