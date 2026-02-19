import { useRef, useMemo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import ProfileSection from '../components/pages/MyPage/ProfileSection';
import BannerSection from '../components/pages/MyPage/BannerSection';
import ConsultationSection from '../components/pages/MyPage/ConsultationSection';
import ChallengeSection from '../components/pages/MyPage/ChallengeSection';
import QuickMenu from '../components/pages/MyPage/QuickMenu';
import CustomerSupportSection from '../components/pages/MyPage/CustomerSupportSection';
import { useAuthStore } from '../stores/useAuthStore';
import { logoutApi } from '../services/auth/loginApi';
import { expertData } from '../data/expertData';
import {
  generateConsultationData,
  getNextConsultation,
} from '../data/consultationData';
import { mypageStateStyles } from '../styles/mypage-state.styles';
import type { UserActivityStatus } from '../types/mypage.types';
import { determineMyPageState, mockChallengeData } from '../types/mypage.types';
import {
  testConfigs,
  ACTIVE_TEST_CONFIG,
  logTestInfo,
} from '../utils/mypage-test-config';

const ScrollContainer = ({ children }: { children: ReactNode }) => {
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
      {children}
    </div>
  );
};

export default function MyPage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const clearAuth = useAuthStore(state => state.clearAuth);

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!user) {
    navigate('/login');
    return null;
  }

  // 실제 상담 데이터에서 가장 빠른 예약완료/상담중 상담 찾기
  const allConsultations = useMemo(() => generateConsultationData(), []);
  const nextConsultation = useMemo(
    () => getNextConsultation(allConsultations),
    [allConsultations],
  );
  // === 테스트 설정 적용 ===
  const testConfig = testConfigs[ACTIVE_TEST_CONFIG];

  // 테스트 로그 출력
  logTestInfo(ACTIVE_TEST_CONFIG);

  // 테스트 설정에 따른 상태 결정
  const hasConsultation = testConfig.hasConsultation
    ? !!nextConsultation
    : false;
  const hasChallenge = testConfig.hasChallenge;

  // 상담 데이터를 마이페이지 형식에 맞게 변환
  const mockConsultation = useMemo(() => {
    if (!nextConsultation) return null;

    const expert =
      expertData.find(e => e.id === nextConsultation.expertId) || expertData[0];
    return {
      id: nextConsultation.id,
      expertName: nextConsultation.expertName,
      expertImage: expert.profile_image,
      date: nextConsultation.date,
      time: nextConsultation.time,
      type: nextConsultation.type,
      status: nextConsultation.status === '예약완료' ? '예약 완료' : '상담 중',
      duration: '30분',
    };
  }, [nextConsultation]);

  // 마이페이지 상태 결정
  const userStatus: UserActivityStatus = {
    hasConsultation,
    hasChallenge,
    nextConsultation,
    challenges: mockChallengeData,
  };

  const myPageState = determineMyPageState(userStatus);

  const handleSettingsClick = () => navigate('/settings');
  const handleProfileEditClick = () => console.log('프로필 수정');
  const handleConsultationDetailClick = () => navigate('/consultation/history');
  const handleConsultationActionClick = () => {
    if (nextConsultation) {
      navigate(`/consultation/rooms/${nextConsultation.id}`);
    }
  };
  const handleChallengeClick = (challengeId?: number) => {
    if (challengeId) {
      // 특정 챌린지 상세 페이지로 이동
      navigate(`/challenge/${challengeId}`);
    } else {
      // 챌린지 현황 페이지로 이동
      navigate('/challenge/status');
    }
  };
  const handleConsultationHistoryClick = () =>
    navigate('/consultation/history');
  const handleExpertClick = () => navigate('/bookmarked/experts');
  const handleClassClick = () => console.log('마이클래스');
  const handleCustomerCenterClick = () => console.log('고객센터');
  const handleInquiryClick = () => console.log('1:1 문의');
  const handleNoticeClick = () => console.log('공지사항');
  const handleBannerClick = () => navigate('/experts');
  const handleLogout = async () => {
    try {
      await logoutApi();
      clearAuth();
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      clearAuth();
      navigate('/');
    }
  };

  return (
    <PageWrapper>
      <ScrollContainer>
        <div className={mypageStateStyles.container}>
          {/* 헤더 */}
          <div className={mypageStateStyles.header.container}>
            <h1 className={mypageStateStyles.header.title}>마이페이지</h1>
            <button onClick={handleSettingsClick}>
              <Settings className={mypageStateStyles.header.settingsIcon} />
            </button>
          </div>

          {/* 메인 콘텐츠 */}
          <div className={mypageStateStyles.content.container}>
            {/* 프로필 섹션 */}
            <ProfileSection
              nickname={user.nickname}
              profileImage="/jpg/experts/profile.png"
              onEditClick={handleProfileEditClick}
            />
            {/* 상태별 콘텐츠 렌더링 */}
            {myPageState === 'basic' && (
              <BannerSection onBannerClick={handleBannerClick} />
            )}
            {myPageState === 'consultation-only' && mockConsultation && (
              <ConsultationSection
                consultation={mockConsultation}
                onDetailClick={handleConsultationDetailClick}
                onActionClick={handleConsultationActionClick}
              />
            )}{' '}
            {myPageState === 'challenge-only' && (
              <>
                <BannerSection onBannerClick={handleBannerClick} />
                <ChallengeSection
                  challenges={mockChallengeData}
                  onChallengeClick={handleChallengeClick}
                />
              </>
            )}
            {myPageState === 'both' && (
              <>
                {mockConsultation && (
                  <ConsultationSection
                    consultation={mockConsultation}
                    onDetailClick={handleConsultationDetailClick}
                    onActionClick={handleConsultationActionClick}
                  />
                )}
                <ChallengeSection
                  challenges={mockChallengeData}
                  onChallengeClick={handleChallengeClick}
                />
              </>
            )}{' '}
            {/* 퀵 메뉴 */}
            <QuickMenu
              onChallengeClick={() => handleChallengeClick()}
              onConsultationClick={handleConsultationHistoryClick}
              onExpertClick={handleExpertClick}
              onClassClick={handleClassClick}
            />
            {/* 고객지원 섹션 */}
            <CustomerSupportSection
              onCustomerCenterClick={handleCustomerCenterClick}
              onInquiryClick={handleInquiryClick}
              onNoticeClick={handleNoticeClick}
            />
            {/* 로그아웃 버튼 */}
            <div className="mt-8 mb-6">
              <button
                onClick={handleLogout}
                className="w-full py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </ScrollContainer>
    </PageWrapper>
  );
}
