// src/components/pages/auth/ResetPasswordForm.tsx
import { useForm } from 'react-hook-form';
import Input from '../../common/Input';
import Button from '../../common/Button';
import { resetPasswordApi } from '../../../services/auth/resetPasswordApi';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authStyles } from '../../../styles/auth.styles';
import Text from '../../common/Text';
import PageWrapper from '../../layout/PageWrapper';
import PageHeader from '../../layout/PageHeader';

const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export default function ResetPasswordForm() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<{ newPassword: string; confirmPassword: string }>({
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  const handlePasswordChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    if (value && !PASSWORD_REGEX.test(value)) {
      setErrorMessage('특수문자, 영문, 숫자를 포함하여 8자 이상 입력해주세요');
    } else {
      setErrorMessage('');
    }
    await trigger(['newPassword', 'confirmPassword']);
  };

  const isFormValid =
    newPassword &&
    confirmPassword &&
    PASSWORD_REGEX.test(newPassword) &&
    newPassword === confirmPassword;

  const onSubmit = async (data: { newPassword: string }) => {
    try {
      await resetPasswordApi({ token, newPassword: data.newPassword });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage('비밀번호 재설정에 실패했습니다.');
    }
  };

  if (isSuccess) {
    return (
      <PageWrapper>
        <PageHeader title="아이디 · 비밀번호 재설정" showBackButton />
        <div className={authStyles.resultContainer}>
          <div className={authStyles.iconWrapper}>
            <img
              src="/public/jpg/icon/FindIcon.png"
              alt="reset-success"
              className={authStyles.icon}
            />
          </div>
          <Text type="H2">비밀번호 변경 완료</Text>
          <Text type="B2" className="mt-2 text-center">
            비밀번호 변경이 완료되었습니다.
            <br />
            새로운 비밀번호로 로그인 해주세요.
          </Text>

          <div className="w-full flex justify-center mt-8">
            <Button
              onClick={() => navigate('/login')}
              className="w-full max-w-[350px]"
            >
              로그인 하러가기
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

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

          <form onSubmit={handleSubmit(onSubmit)} className={authStyles.form}>
            <div className={authStyles.iconWrapper}>
              <img
                src="/jpg/icon/SettingIcon.png"
                alt="sendverification"
                className={authStyles.icon}
              />
            </div>
            <Text type="H2" className="text-center">
              새 비밀번호 설정
            </Text>
            <Text type="B2" className="text-center mb-4">
              특수문자, 영문, 숫자를 포함하여 8자 이상 입력해주세요
            </Text>{' '}
            <div className="w-full space-y-4 flex flex-col items-center">
              <div className="space-y-2 w-full max-w-[350px]">
                <Input
                  {...register('newPassword', {
                    required: true,
                    pattern: {
                      value: PASSWORD_REGEX,
                      message: '',
                    },
                  })}
                  type="password"
                  hasToggle
                  placeholder="비밀번호를 입력해주세요"
                  onChange={handlePasswordChange}
                  className="w-full"
                />
                {errorMessage && (
                  <Text type="B3" className="text-red-500">
                    {errorMessage}
                  </Text>
                )}
              </div>

              <div className="space-y-2 w-full max-w-[350px]">
                <Input
                  {...register('confirmPassword', {
                    required: '비밀번호 확인을 입력해주세요',
                    validate: value =>
                      value === newPassword || '비밀번호가 일치하지 않습니다',
                  })}
                  type="password"
                  hasToggle
                  placeholder="비밀번호를 다시 입력해주세요"
                  className="w-full"
                />
                {errors.confirmPassword && (
                  <Text type="B3" className="text-red-500">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </div>
            </div>
            <div className="mt-6">
              <Button
                type="submit"
                disabled={!isFormValid}
                variant={!isFormValid ? 'disabled' : 'primary'}
              >
                비밀번호 재설정
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
