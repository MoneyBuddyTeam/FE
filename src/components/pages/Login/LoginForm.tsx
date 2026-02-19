import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../common/Input';
import { loginApi } from '../../../services/auth/loginApi';
import { EMAIL_REGEX } from '../../../utils';
import { useAuthStore } from '../../../stores/useAuthStore';
import type { LoginRequest } from '../../../types/auth';
import Button from '../../common/Button';
import { loginStyles } from '../../../styles/login.styles';

type LoginFormValues = LoginRequest & { autoLogin: boolean };

export default function LoginForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    mode: 'onChange',
    defaultValues: { email: '', password: '', autoLogin: false },
  });
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const { autoLogin, ...loginData } = data;
      const response = await loginApi(loginData);

      // 명세서에 따른 Map 형식 응답 처리
      const accessToken = response.token;
      const userInfo = {
        id: response.userId || Date.now(), // 응답의 userId 사용, 없으면 임시 생성
        email: response.email,
        nickname: response.nickname,
        role: 'USER' as const,
        profile_image: '/jpg/experts/expert1.png',
      };

      setAuth(userInfo, accessToken, '');
      navigate('/');
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        'response' in err &&
        (err as any).response?.status === 401
      ) {
        setError('password', {
          message: '이메일 또는 비밀번호가 올바르지 않습니다.',
        });
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          {...register('email', {
            required: '이메일을 입력해주세요',
            pattern: {
              value: EMAIL_REGEX,
              message: '이메일 형식이 올바르지 않습니다',
            },
          })}
          placeholder="이메일을 입력해주세요"
          className={loginStyles.input}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Input
          {...register('password', { required: '비밀번호를 입력해주세요' })}
          type="password"
          hasToggle
          placeholder="비밀번호를 입력해주세요"
          className={loginStyles.input}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={!isValid || isSubmitting || Object.keys(errors).length > 0}
        variant={
          !isValid || isSubmitting || Object.keys(errors).length > 0
            ? 'disabled'
            : 'primary'
        }
      >
        {isSubmitting ? '로그인 중...' : '로그인'}
      </Button>
    </form>
  );
}
