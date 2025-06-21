import { useState, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/useAuthStore';
import { useCurrentUser, useUpdateUser } from '../hooks/useUserProfile';
import { useUnlinkSocial } from '../hooks/useChangePassword';
import { useVerifyPassword } from '../hooks/useVerifyPassword';
import PageWrapper from '../components/layout/PageWrapper';
import PageHeader from '../components/layout/PageHeader';
import ProfileImageSection from '../components/pages/Settings/ProfileImageSection';
import NicknameSection from '../components/pages/Settings/NicknameSection';
import EmailSection from '../components/pages/Settings/EmailSection';
import SettingsMenuList from '../components/pages/Settings/SettingsMenuList';
import NicknameChangeModal from '../components/pages/Settings/NicknameChangeModal';
import { settingsStyles } from '../styles/settings.styles';

// 스크롤 컨테이너 컴포넌트
const ScrollContainer = ({
  children,
  title = '프로필 수정',
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

export default function SettingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);
  const setAuth = useAuthStore(state => state.setAuth);
  const { data: currentUser } = useCurrentUser();
  const updateUserMutation = useUpdateUser();
  const unlinkSocialMutation = useUnlinkSocial();
  const verifyPasswordMutation = useVerifyPassword();

  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false); // 현재 사용자 정보 (zustand에서 가져오거나 API에서 가져온 데이터 사용)
  const userInfo = currentUser || user;

  console.log('🔍 SettingsPage - userInfo:', userInfo);
  console.log('🔍 SettingsPage - currentUser:', currentUser);
  console.log('🔍 SettingsPage - user:', user);

  // 현재 표시될 닉네임 (최신 상태 반영)
  const displayNickname =
    user?.nickname ||
    currentUser?.nickname ||
    userInfo?.nickname ||
    '테스트사용자';

  if (!userInfo) {
    navigate('/login');
    return null;
  }

  // 진행 중인 상담이 있는지 확인 (실제로는 API에서 확인해야 함)
  const hasOngoingConsultation = false;

  const handleProfileImageChange = () => {
    // 프로필 이미지 변경 로직 (파일 업로드 등)
    console.log('프로필 이미지 변경');
  };

  const handleNicknameChange = () => {
    if (!hasOngoingConsultation) {
      setIsNicknameModalOpen(true);
    }
  };
  const handleNicknameSubmit = async (newNickname: string) => {
    console.log('🔍 SettingsPage - 닉네임 변경 핸들러 시작:', newNickname);
    console.log('🔍 현재 userInfo:', userInfo);

    try {
      if (userInfo.id) {
        console.log('🔍 API 호출 시작 - userInfo.id:', userInfo.id);

        await updateUserMutation.mutateAsync({
          id: userInfo.id,
          data: { nickname: newNickname },
        });

        console.log('🔍 API 호출 성공');

        // Zustand 스토어 업데이트
        if (user) {
          console.log('🔍 Zustand 스토어 업데이트 시작');
          setAuth(
            { ...user, nickname: newNickname },
            localStorage.getItem('auth-storage')
              ? JSON.parse(localStorage.getItem('auth-storage')!)?.state
                  ?.accessToken
              : null,
            localStorage.getItem('auth-storage')
              ? JSON.parse(localStorage.getItem('auth-storage')!)?.state
                  ?.refreshToken
              : null,
          );
          console.log('🔍 Zustand 스토어 업데이트 완료');
        }

        // React Query 캐시 무효화로 UI 즉시 업데이트
        queryClient.invalidateQueries({ queryKey: ['user'] });
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        console.log('🔍 캐시 무효화 완료');

        console.log('닉네임 변경 성공:', newNickname);
      } else {
        console.error('🔍 userInfo.id가 없음:', userInfo);
        throw new Error('사용자 ID를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('🔍 닉네임 변경 실패:', error);
      alert('닉네임 변경에 실패했습니다.');
      throw error;
    }
  };

  const handleFinancialFieldChange = () => {
    console.log('금융분야 변경');
  };
  const handlePasswordChange = () => {
    console.log('비밀번호 변경');
    navigate('/password-change');
  };

  const handleSecuritySettings = () => {
    // 보안 설정에서 소셜 연동 해제 기능 추가
    navigate('/settings/security');
  };

  const handleNotificationSettings = () => {
    console.log('알림 설정');
  };

  const handleCustomerCenter = () => {
    console.log('고객센터');
  };
  const handleWithdraw = () => {
    navigate('/withdraw');
  };

  const handleUnlinkSocial = async () => {
    if (window.confirm('소셜 연동을 해제하시겠습니까?')) {
      try {
        await unlinkSocialMutation.mutateAsync();
        alert('소셜 연동이 해제되었습니다.');
      } catch (error) {
        console.error('소셜 연동 해제 실패:', error);
        alert('소셜 연동 해제에 실패했습니다.');
      }
    }
  };

  const handlePasswordVerification = async () => {
    const password = prompt('비밀번호를 입력하세요:');
    if (!password) return;

    try {
      await verifyPasswordMutation.mutateAsync(password);
      alert('비밀번호가 확인되었습니다.');
      // 보안 설정 페이지로 이동 등의 추가 로직
    } catch (error) {
      console.error('비밀번호 확인 실패:', error);
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <PageWrapper>
      <ScrollContainer>
        <div className={settingsStyles.container}>
          {/* 프로필 섹션 */}
          <div className={settingsStyles.profileSection}>
            <ProfileImageSection
              profileImage={
                (userInfo as any).profile_image || '/jpg/experts/profile.png'
              }
              onImageChange={handleProfileImageChange}
            />
            <NicknameSection
              nickname={displayNickname}
              hasOngoingConsultation={hasOngoingConsultation}
              onNicknameChange={handleNicknameChange}
            />{' '}
            <EmailSection
              email={(userInfo as any).email || 'email@email.coco'}
              isVerified={true}
            />
          </div>

          {/* 구분선 */}
          <div className={settingsStyles.separator} />

          {/* 설정 메뉴 */}
          <SettingsMenuList
            onFinancialFieldChange={handleFinancialFieldChange}
            onPasswordChange={handlePasswordChange}
            onSecuritySettings={handleSecuritySettings}
            onNotificationSettings={handleNotificationSettings}
            onCustomerCenter={handleCustomerCenter}
          />

          {/* 회원 탈퇴 */}
          <div className={settingsStyles.withdrawSection}>
            <button
              onClick={handleWithdraw}
              className={settingsStyles.withdrawText}
            >
              회원 탈퇴하기
            </button>
          </div>
        </div>
      </ScrollContainer>{' '}
      {/* 닉네임 변경 모달 */}
      <NicknameChangeModal
        isOpen={isNicknameModalOpen}
        onClose={() => setIsNicknameModalOpen(false)}
        onSubmit={handleNicknameSubmit}
        currentNickname={displayNickname}
      />
    </PageWrapper>
  );
}
