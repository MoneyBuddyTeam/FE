import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import PageHeader from '../../components/layout/PageHeader';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Text from '../../components/common/Text';
import { useRecoverAccount } from '../../hooks/useNewApiFeatures';
import { EMAIL_REGEX } from '../../utils';
import type { RecoverAccountRequest } from '../../types/auth';

export default function AccountRecoveryPage() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [recoveredUser, setRecoveredUser] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RecoverAccountRequest>({
    mode: 'onChange',
  });

  const { mutateAsync: recoverAccount, isPending } = useRecoverAccount();

  const onSubmit = async (data: RecoverAccountRequest) => {
    try {
      const response = await recoverAccount(data);
      setRecoveredUser(response);
      setIsSuccess(true);
    } catch (error: any) {
      console.error('계정 복구 실패:', error);
      alert(error.message || '계정 복구에 실패했습니다.');
    }
  };

  if (isSuccess && recoveredUser) {
    return (
      <PageWrapper>
        <PageHeader title="계정 복구" showBackButton={false} />
        <div className="flex flex-col items-center justify-center px-5 py-12 min-h-[600px]">
          <img
            src="/jpg/icon/SettingIcon.png"
            alt="계정 복구 완료"
            className="w-24 h-24 mb-6"
          />
          <h1 className="text-2xl font-bold mb-2 text-center text-[#111111]">
            계정 복구 완료
          </h1>
          <p className="text-[#777777] text-center mb-8 text-[14px] leading-[150%]">
            계정이 성공적으로 복구되었습니다.
            <br />
            다시 서비스를 이용하실 수 있습니다.
          </p>

          <div className="bg-gray-50 w-full p-5 rounded-lg mb-8">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">이메일</span>
              <span className="font-medium">{recoveredUser.email}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">닉네임</span>
              <span className="font-medium">{recoveredUser.nickname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">복구일시</span>
              <span className="font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="w-full">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-[#6488FF] text-white py-3 rounded-md text-center font-semibold text-[16px] hover:bg-[#5577EE] transition-colors"
            >
              로그인 하러가기
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader title="계정 복구" />
      <div className="px-5 py-8">
        <div className="text-center mb-8">
          <img
            src="/jpg/icon/VerificationIcon.png"
            alt="계정 복구 아이콘"
            className="w-16 h-16 mx-auto mb-4"
          />
          <Text type="H2" className="mb-4">
            탈퇴한 계정 복구
          </Text>
          <Text type="B2" className="text-gray-600">
            탈퇴한 지 30일 이내인 계정만 복구 가능합니다.
            <br />
            가입하셨던 이메일을 입력해주세요.
          </Text>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register('email', {
                required: '이메일을 입력해주세요',
                pattern: {
                  value: EMAIL_REGEX,
                  message: '올바른 이메일 형식이 아닙니다',
                },
              })}
              placeholder="이메일 주소 입력"
              className="w-full"
            />
            {errors.email && (
              <Text type="B3" className="text-red-500 mt-1">
                {errors.email.message}
              </Text>
            )}
          </div>

          <Button
            type="submit"
            disabled={!isValid || isPending}
            variant={!isValid || isPending ? 'disabled' : 'primary'}
            className="w-full mt-6"
          >
            {isPending ? '복구 중...' : '계정 복구'}
          </Button>
        </form>

        <div className="text-center mt-8">
          <Text type="B3" className="text-gray-500">
            계정 복구가 어려우신가요?{' '}
            <span
              className="text-blue-500 underline cursor-pointer"
              onClick={() => navigate('/find-account')}
            >
              고객센터 문의
            </span>
          </Text>
        </div>
      </div>
    </PageWrapper>
  );
}
