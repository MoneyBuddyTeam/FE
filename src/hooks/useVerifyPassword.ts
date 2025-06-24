import { useMutation } from '@tanstack/react-query';
import { verifyPassword } from '../services/auth/userApi';

// 비밀번호 확인 훅
export const useVerifyPassword = () => {
  return useMutation({
    mutationFn: verifyPassword,
    onSuccess: () => {
      console.log('✅ 비밀번호 확인 성공');
    },
    onError: error => {
      console.error('❌ 비밀번호 확인 실패:', error);
    },
  });
};
