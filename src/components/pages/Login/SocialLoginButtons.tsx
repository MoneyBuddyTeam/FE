import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/useAuthStore';
import {
  getSocialLoginUrl,
  socialLoginApi,
} from '../../../services/auth/loginApi';
import { loginStyles } from '../../../styles/login.styles';

type SocialProvider = 'kakao' | 'google' | 'naver';

type SocialLoginButtonsProps = {
  onSocialLogin?: (provider: SocialProvider) => void;
};

export default function SocialLoginButtons({
  onSocialLogin,
}: SocialLoginButtonsProps) {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleSocialLogin = async (provider: SocialProvider) => {
    try {
      console.log(`🔐 ${provider} 소셜 로그인 시작`);

      // 소셜 로그인 URL 가져오기
      const loginUrl = await getSocialLoginUrl(provider);

      // 팝업 창 열기
      const popup = window.open(
        loginUrl,
        `${provider}_login`,
        'width=500,height=600,scrollbars=yes,resizable=yes',
      );

      if (!popup) {
        alert('팝업이 차단되었습니다. 팝업을 허용해주세요.');
        return;
      }

      // 팝업에서 메시지 받기
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) {
          return;
        }

        const { provider: messageProvider, authCode } = event.data;

        if (messageProvider === provider && authCode) {
          try {
            console.log(`✅ ${provider} 인증 코드 수신:`, authCode);
            // 소셜 로그인 API 호출
            const response = await socialLoginApi(provider, authCode);

            // MSW 응답 구조에 따라 토큰 추출
            const accessToken =
              response.tokens?.access_token || response.accessToken;
            const refreshToken =
              response.tokens?.refresh_token || response.refreshToken;

            // 인증 상태 저장
            if (response.user && accessToken && refreshToken) {
              setAuth(response.user, accessToken, refreshToken);
            } else {
              throw new Error('사용자 정보 또는 토큰을 받아올 수 없습니다.');
            }

            // 홈페이지로 이동
            navigate('/');

            console.log(`✅ ${provider} 로그인 완료`);
          } catch (error) {
            console.error(`❌ ${provider} 로그인 실패:`, error);
            alert(`${provider} 로그인에 실패했습니다.`);
          } finally {
            popup.close();
            window.removeEventListener('message', handleMessage);
          }
        }
      };

      // 메시지 이벤트 리스너 등록
      window.addEventListener('message', handleMessage);

      // 팝업이 닫혔는지 확인
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          console.log(`${provider} 로그인 팝업이 닫혔습니다.`);
        }
      }, 1000);
    } catch (error) {
      console.error(`❌ ${provider} 소셜 로그인 오류:`, error);
      alert('소셜 로그인 중 오류가 발생했습니다.');
    }

    // 기존 콜백도 호출 (필요한 경우)
    onSocialLogin?.(provider);
  };

  return (
    <div className={loginStyles.socialButtonsWrapper}>
      <button
        type="button"
        onClick={() => handleSocialLogin('kakao')}
        className={loginStyles.socialButton}
      >
        <img
          src="/jpg/SocialLoginButton/kakao.png"
          alt="카카오 계정으로 1초 만에 시작하기"
          className="w-full h-full"
        />
      </button>

      <button
        type="button"
        onClick={() => handleSocialLogin('google')}
        className={loginStyles.socialButton}
      >
        <img
          src="/jpg/SocialLoginButton/google.png"
          alt="구글 계정으로 시작하기"
          className="w-full h-full"
        />
      </button>

      <button
        type="button"
        onClick={() => handleSocialLogin('naver')}
        className={loginStyles.socialButton}
      >
        <img
          src="/jpg/SocialLoginButton/naver.png"
          alt="네이버 계정으로 시작하기"
          className="w-full h-full"
        />
      </button>
    </div>
  );
}
