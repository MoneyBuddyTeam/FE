import { useState, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import PageHeader from '../components/layout/PageHeader';
import PasswordInputSection from '../components/pages/Withdraw/PasswordInputSection';
import WithdrawReasonSection from '../components/pages/Withdraw/WithdrawReasonSection';
import WithdrawWarningSection from '../components/pages/Withdraw/WithdrawWarningSection';
import WithdrawConfirmModal from '../components/pages/Withdraw/WithdrawConfirmModal';
import WithdrawSuccessModal from '../components/pages/Withdraw/WithdrawSuccessModal';
import {
  useVerifyPasswordForWithdraw,
  useWithdrawUser,
} from '../hooks/useWithdraw';
import { useAuthStore } from '../stores/useAuthStore';
import { withdrawStyles } from '../styles/withdraw.styles';

type WithdrawStep = 'password' | 'reason' | 'warning';

// 스크롤 컨테이너 컴포넌트
const ScrollContainer = ({
  children,
  title = '회원탈퇴',
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

export default function WithdrawPage() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore(state => state.clearAuth);
  const user = useAuthStore(state => state.user);
  const accessToken = useAuthStore(state => state.accessToken);

  console.log('🔍 WithdrawPage - 사용자 상태:', {
    user,
    hasToken: !!accessToken,
  });

  const [step, setStep] = useState<WithdrawStep>('password');
  const [password, setPassword] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false); // 비밀번호 검증 성공 여부
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 비밀번호 확인 hook
  const verifyPasswordMutation = useVerifyPasswordForWithdraw({
    onSuccess: () => {
      setPasswordError('');
      setIsPasswordVerified(true); // 비밀번호 검증 성공 표시
      setStep('reason');
    },
    onError: (error: any) => {
      setIsPasswordVerified(false); // 비밀번호 검증 실패 표시
      setPasswordError(
        error.response?.data?.message || '비밀번호 확인에 실패했습니다.',
      );
    },
  });

  // 회원탈퇴 hook
  const withdrawMutation = useWithdrawUser({
    onSuccess: () => {
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    },
    onError: (error: any) => {
      console.error('회원탈퇴 실패:', error);
      alert('회원탈퇴에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const handlePasswordSubmit = () => {
    if (!password) return;

    // 비밀번호 검증 전에 에러 상태 초기화
    setPasswordError('');
    setIsPasswordVerified(false);

    verifyPasswordMutation.mutate(password);
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    // 비밀번호가 변경되면 이전 검증 상태와 에러를 초기화
    if (passwordError) {
      setPasswordError('');
    }
    setIsPasswordVerified(false);
  };

  const handleReasonNext = () => {
    if (!selectedReason) return;
    setStep('warning');
  };

  const handleFinalSubmit = () => {
    setShowConfirmModal(true);
  };
  const handleConfirmWithdraw = () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      alert('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    withdrawMutation.mutate();
  };
  const handleWithdrawComplete = () => {
    clearAuth();
    navigate('/login');
  };

  const handleForgotPassword = () => {
    navigate('/find-account');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const getStepTitle = () => {
    switch (step) {
      case 'password':
        return '탈퇴에 앞서, 비밀번호를 입력해주세요';
      case 'reason':
        return '왜 탈퇴를 결심하셨나요?';
      case 'warning':
        return '탈퇴전 꼭 확인해주세요';
      default:
        return '회원탈퇴';
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 'password':
        return password.length > 0 && !verifyPasswordMutation.isPending; // 비밀번호가 있고 요청 중이 아닐 때만
      case 'reason':
        return selectedReason.length > 0;
      case 'warning':
        return true;
      default:
        return false;
    }
  };

  const getButtonText = () => {
    switch (step) {
      case 'password':
        return '다음';
      case 'reason':
        return '다음';
      case 'warning':
        return '탈퇴하기';
      default:
        return '다음';
    }
  };

  const handleStepSubmit = () => {
    switch (step) {
      case 'password':
        handlePasswordSubmit();
        break;
      case 'reason':
        handleReasonNext();
        break;
      case 'warning':
        handleFinalSubmit();
        break;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'password':
        return (
          <PasswordInputSection
            password={password}
            onPasswordChange={handlePasswordChange}
            error={passwordError}
            onForgotPassword={handleForgotPassword}
          />
        );
      case 'reason':
        return (
          <WithdrawReasonSection
            selectedReason={selectedReason}
            onReasonSelect={setSelectedReason}
          />
        );
      case 'warning':
        return <WithdrawWarningSection />;
      default:
        return null;
    }
  };

  // 하단 버튼 컴포넌트
  const BottomButtons = (
    <div className={withdrawStyles.bottomSection.container}>
      <div className={withdrawStyles.bottomSection.buttonGroup}>
        <button
          onClick={handleCancel}
          className={withdrawStyles.bottomSection.cancelButton}
        >
          <span className={withdrawStyles.bottomSection.cancelButtonText}>
            이전
          </span>
        </button>

        <button
          onClick={handleStepSubmit}
          disabled={
            !isStepValid() ||
            verifyPasswordMutation.isPending ||
            withdrawMutation.isPending
          }
          className={`${withdrawStyles.bottomSection.submitButton} ${
            isStepValid() &&
            !verifyPasswordMutation.isPending &&
            !withdrawMutation.isPending
              ? withdrawStyles.bottomSection.submitButtonActive
              : withdrawStyles.bottomSection.submitButtonDisabled
          }`}
        >
          <span className={withdrawStyles.bottomSection.submitButtonText}>
            {verifyPasswordMutation.isPending || withdrawMutation.isPending
              ? '처리중...'
              : getButtonText()}
          </span>
        </button>
      </div>
    </div>
  );
  return (
    <PageWrapper bottomElement={BottomButtons}>
      <ScrollContainer title={getStepTitle()}>
        <div className={withdrawStyles.container}>
          {/* 단계별 콘텐츠 */}
          {renderStepContent()}
        </div>
      </ScrollContainer>

      {/* 확인 모달 */}
      <WithdrawConfirmModal
        isOpen={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmWithdraw}
      />

      {/* 완료 모달 */}
      <WithdrawSuccessModal
        isOpen={showSuccessModal}
        onConfirm={handleWithdrawComplete}
      />
    </PageWrapper>
  );
}
