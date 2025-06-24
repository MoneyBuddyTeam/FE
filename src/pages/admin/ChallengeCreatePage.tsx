import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import PageHeader from '../../components/layout/PageHeader';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Text from '../../components/common/Text';
import { useCreateChallenge } from '../../hooks/useNewApiFeatures';
import type { CreateChallengeRequest } from '../../types/auth';

export default function ChallengeCreatePage() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdChallenge, setCreatedChallenge] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateChallengeRequest>({
    mode: 'onChange',
  });

  const { mutateAsync: createChallenge, isPending } = useCreateChallenge();

  const onSubmit = async (data: CreateChallengeRequest) => {
    try {
      const response = await createChallenge(data);
      setCreatedChallenge(response);
      setIsSuccess(true);
    } catch (error: any) {
      console.error('챌린지 생성 실패:', error);
      alert(error.message || '챌린지 생성에 실패했습니다.');
    }
  };

  if (isSuccess && createdChallenge) {
    return (
      <PageWrapper>
        <PageHeader title="챌린지 생성" showBackButton={false} />
        <div className="flex flex-col items-center justify-center px-5 py-12 min-h-[600px]">
          <img
            src="/jpg/icon/SettingIcon.png"
            alt="챌린지 생성 완료"
            className="w-24 h-24 mb-6"
          />
          <h1 className="text-2xl font-bold mb-2 text-center text-[#111111]">
            챌린지 생성 완료
          </h1>
          <p className="text-[#777777] text-center mb-8 text-[14px] leading-[150%]">
            새로운 챌린지가 성공적으로 생성되었습니다.
            <br />
            사용자들이 참여할 수 있습니다.
          </p>

          <div className="bg-gray-50 w-full p-5 rounded-lg mb-8">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">챌린지 제목</span>
              <span className="font-medium">{createdChallenge.title}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">설명</span>
              <span className="font-medium text-right max-w-[200px]">
                {createdChallenge.description}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">생성일시</span>
              <span className="font-medium">
                {new Date(createdChallenge.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="w-full space-y-3">
            <button
              onClick={() => navigate('/admin/challenges')}
              className="w-full bg-[#6488FF] text-white py-3 rounded-md text-center font-semibold text-[16px] hover:bg-[#5577EE] transition-colors"
            >
              챌린지 관리로 이동
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-md text-center font-semibold text-[16px] hover:bg-gray-300 transition-colors"
            >
              새 챌린지 생성
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader title="챌린지 생성" />
      <div className="px-5 py-8">
        <div className="text-center mb-8">
          <img
            src="/jpg/icon/SettingIcon.png"
            alt="챌린지 생성 아이콘"
            className="w-16 h-16 mx-auto mb-4"
          />
          <Text type="H2" className="mb-4">
            새 챌린지 만들기
          </Text>
          <Text type="B2" className="text-gray-600">
            사용자들이 참여할 수 있는 새로운 챌린지를 생성합니다.
            <br />
            제목과 설명을 입력해주세요.
          </Text>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              챌린지 제목 *
            </label>
            <Input
              {...register('title', {
                required: '챌린지 제목을 입력해주세요',
                minLength: {
                  value: 5,
                  message: '제목은 5자 이상 입력해주세요',
                },
                maxLength: {
                  value: 50,
                  message: '제목은 50자 이하로 입력해주세요',
                },
              })}
              placeholder="예: 30일 소비 기록 챌린지"
              className="w-full"
            />
            {errors.title && (
              <Text type="B3" className="text-red-500 mt-1">
                {errors.title.message}
              </Text>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              챌린지 설명 *
            </label>
            <textarea
              {...register('description', {
                required: '챌린지 설명을 입력해주세요',
                minLength: {
                  value: 10,
                  message: '설명은 10자 이상 입력해주세요',
                },
                maxLength: {
                  value: 200,
                  message: '설명은 200자 이하로 입력해주세요',
                },
              })}
              placeholder="예: 매일 소비 내용을 기록하고 검토하는 습관을 만드는 챌린지입니다."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            {errors.description && (
              <Text type="B3" className="text-red-500 mt-1">
                {errors.description.message}
              </Text>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <Text type="B3" className="text-blue-700">
              💡 챌린지 생성 안내
            </Text>
            <ul className="mt-2 text-sm text-blue-600 space-y-1">
              <li>• 생성된 챌린지는 즉시 사용자에게 공개됩니다</li>
              <li>• 참여자들을 위한 미션은 별도로 추가할 수 있습니다</li>
              <li>• 챌린지 수정은 관리자 페이지에서 가능합니다</li>
            </ul>
          </div>

          <Button
            type="submit"
            disabled={!isValid || isPending}
            variant={!isValid || isPending ? 'disabled' : 'primary'}
            className="w-full mt-6"
          >
            {isPending ? '생성 중...' : '챌린지 생성'}
          </Button>
        </form>
      </div>
    </PageWrapper>
  );
}
