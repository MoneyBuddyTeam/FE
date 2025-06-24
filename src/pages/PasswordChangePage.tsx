import { useState } from 'react';
import { useForm } from 'react-hook-form';
import PageWrapper from '../components/layout/PageWrapper';
import PageHeader from '../components/layout/PageHeader';
import CurrentPasswordSection from '../components/pages/PasswordChange/CurrentPasswordSection';
import NewPasswordSection from '../components/pages/PasswordChange/NewPasswordSection';
import SubmitSection from '../components/pages/PasswordChange/SubmitSection';
import PasswordChangeSuccess from '../components/pages/PasswordChange/PasswordChangeSuccess';
import { useChangePassword } from '../hooks/useChangePassword';

interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{10,}$/;

// 스크롤 컨테이너 컴포넌트

export default function PasswordChangePage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState<string>('');
  const {
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    setValue,
  } = useForm<PasswordChangeFormData>({
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { mutateAsync: changePassword, isPending } = useChangePassword();

  const currentPassword = watch('currentPassword');
  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  // 폼 유효성 검사
  const isFormValid = Boolean(
    currentPassword &&
      newPassword &&
      confirmPassword &&
      PASSWORD_REGEX.test(newPassword) &&
      newPassword === confirmPassword,
  );

  // onSubmit 함수에서 기존 비밀번호 오류 처리 추가
  const onSubmit = async (data: PasswordChangeFormData) => {
    try {
      setCurrentPasswordError('');

      // 새 비밀번호 유효성 검사
      if (!PASSWORD_REGEX.test(data.newPassword)) {
        setError('newPassword', {
          message: '영문, 숫자, 특수문자 포함 10자 이상 입력해주세요.',
        });
        return;
      }

      // 비밀번호 확인 검사
      if (data.newPassword !== data.confirmPassword) {
        setError('confirmPassword', {
          message: '비밀번호가 일치하지 않습니다.',
        });
        return;
      }

      // 비밀번호 변경 API 호출
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      setIsSuccess(true);
    } catch (error: any) {
      console.log('비밀번호 변경 실패:', error);
      // 기존 비밀번호 오류인 경우 해당 필드에 에러 설정
      if (
        error.message &&
        (error.message.includes('틀린 비밀번호') ||
          error.message.includes('기존 비밀번호'))
      ) {
        setCurrentPasswordError('기존 비밀번호와 일치하지 않습니다.');
      } else {
        setError('root', {
          type: 'error',
          message: '비밀번호 변경에 실패했습니다. 다시 시도해주세요.',
        });
      }
    }
  };

  if (isSuccess) {
    return (
      <PageWrapper className="mt-12">
        <PageHeader title="비밀번호 변경" showBackButton />
        <div className="px-5 py-5">
          <PasswordChangeSuccess />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="mt-12">
      <PageHeader title="비밀번호 변경" showBackButton />
      <div className="px-5 py-5">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <CurrentPasswordSection
            currentPassword={currentPassword}
            setCurrentPassword={password =>
              setValue('currentPassword', password)
            }
            error={currentPasswordError}
          />

          <NewPasswordSection
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            setNewPassword={password => setValue('newPassword', password)}
            setConfirmPassword={password =>
              setValue('confirmPassword', password)
            }
            errors={{
              newPassword: errors.newPassword?.message,
              confirmPassword: errors.confirmPassword?.message,
            }}
          />

          <SubmitSection
            isFormValid={isFormValid}
            onSubmit={handleSubmit(onSubmit)}
            isLoading={isPending}
          />
        </form>
      </div>
    </PageWrapper>
  );
}
