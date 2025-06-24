// src/pages/FindPage/ResetPasswordVerifyPage.tsx
import PageWrapper from '../../components/layout/PageWrapper';
import PageHeader from '../../components/layout/PageHeader';
import ResetPasswordVerifyForm from '../../components/pages/auth/ResetPasswordVerifyForm';
import Text from '../../components/common/Text';
import { authStyles } from '../../styles/auth.styles';
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordVerifyPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <PageHeader title="아이디 · 비밀번호 재설정" showBackButton />

      <div className={authStyles.wrapper}>
        <div className={authStyles.container}>
          <div className={authStyles.tabContainer}>
            <button
              onClick={() => navigate('/find-account')}
              className={`${authStyles.tab} ${authStyles.inactiveTab}`}
            >
              <Text type="B1">아이디 찾기</Text>
            </button>
            <button className={`${authStyles.tab} ${authStyles.activeTab}`}>
              <Text type="B1">비밀번호 재설정</Text>
            </button>
          </div>

          <ResetPasswordVerifyForm />
        </div>
      </div>
    </PageWrapper>
  );
}
