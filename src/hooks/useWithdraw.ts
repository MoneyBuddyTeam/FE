import { useMutation } from '@tanstack/react-query';
import {
  verifyPasswordForWithdraw,
  withdrawUser,
} from '../services/auth/withdrawApi';

// 탈퇴용 비밀번호 확인 훅
export const useVerifyPasswordForWithdraw = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: (password: string) => {
      console.log('🔐 클라이언트: 탈퇴용 비밀번호 확인 요청 시작', {
        password,
      });
      return verifyPasswordForWithdraw(password);
    },
    onSuccess: data => {
      console.log('✅ 클라이언트: 탈퇴용 비밀번호 확인 성공', data);
      options?.onSuccess?.();
    },
    onError: error => {
      console.error('❌ 클라이언트: 탈퇴용 비밀번호 확인 실패:', error);
      options?.onError?.(error);
    },
  });
};

// 회원탈퇴 훅
export const useWithdrawUser = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: withdrawUser,
    onSuccess: () => {
      console.log('✅ 회원탈퇴 성공');
      // 로컬 스토리지 정리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      options?.onSuccess?.();
    },
    onError: error => {
      console.error('❌ 회원탈퇴 실패:', error);
      options?.onError?.(error);
    },
  });
};
