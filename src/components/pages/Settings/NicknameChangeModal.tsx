import { useState } from 'react';
import { useForm } from 'react-hook-form';
import BottomSheetModal from '../../common/BottomSheetModal';
import Text from '../../common/Text';

interface NicknameChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nickname: string) => Promise<void> | void;
  currentNickname?: string;
}

interface FormValues {
  nickname: string;
}

export default function NicknameChangeModal({
  isOpen,
  onClose,
  onSubmit,
  currentNickname = '',
}: NicknameChangeModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      nickname: currentNickname,
    },
  });

  const [nicknameError, setNicknameError] = useState('');
  const nickname = watch('nickname');

  // 버튼 활성화 상태 관리
  const isButtonDisabled =
    !nickname ||
    nickname.trim() === '' ||
    nickname === currentNickname ||
    !!nicknameError;
  const validateAndSubmit = async (data: FormValues) => {
    console.log('🔍 닉네임 변경 시작:', data.nickname);

    try {
      // 중복만 아니면 통과
      if (data.nickname === currentNickname) {
        setNicknameError('현재 닉네임과 동일합니다.');
        return;
      }

      // 닉네임 유효성 검사
      if (!data.nickname || data.nickname.trim().length === 0) {
        setNicknameError('닉네임을 입력해주세요.');
        return;
      }

      if (data.nickname.trim().length > 10) {
        setNicknameError('닉네임은 10자 이하로 입력해주세요.');
        return;
      }

      console.log('🔍 onSubmit 호출 전');
      await onSubmit(data.nickname.trim());
      console.log('🔍 onSubmit 완료, 모달 닫기');

      // 폼 리셋 및 모달 닫기
      reset({ nickname: data.nickname.trim() });
      onClose();
    } catch (error) {
      console.error('🔍 닉네임 변경 에러:', error);
      setNicknameError('닉네임 변경에 실패했습니다.');
    }
  };

  const handleNicknameChange = () => {
    setNicknameError('');
  };

  if (!isOpen) return null;

  const buttonClassName = isButtonDisabled
    ? 'w-full py-3 rounded-lg font-medium bg-gray-300 text-gray-500 cursor-not-allowed'
    : 'w-full py-3 rounded-lg font-medium bg-primary text-white hover:bg-blue-600 transition-colors';

  return (
    <BottomSheetModal isOpen={isOpen} onClose={onClose} className="h-[240px]">
      <div className="w-full p-5">
        <Text type="H2" className="mb-4">
          변경할 닉네임을 입력해주세요
        </Text>

        <form onSubmit={handleSubmit(validateAndSubmit)} className="w-full">
          <div className="mb-4">
            {' '}
            <input
              {...register('nickname', {
                required: '닉네임을 입력해주세요',
              })}
              onChange={e => {
                register('nickname').onChange(e);
                handleNicknameChange();
              }}
              placeholder="새로운 닉네임"
              className="w-full h-[50px] px-4 py-3 border border-[#F1F1F1] rounded-lg focus:outline-none focus:border-primary"
            />
            {(errors.nickname || nicknameError) && (
              <Text type="B3" className="text-red-500 mt-1">
                {errors.nickname?.message || nicknameError}
              </Text>
            )}
          </div>

          <button
            type="submit"
            disabled={isButtonDisabled}
            className={buttonClassName}
          >
            변경하기
          </button>
        </form>
      </div>
    </BottomSheetModal>
  );
}
