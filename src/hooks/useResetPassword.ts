// 비밀번호 재설정 관련 Hook
import { useMutation } from '@tanstack/react-query';
import {
  requestResetPasswordApi,
  verifyResetCodeApi,
  resetPasswordApi,
} from '../services/auth/resetPasswordApi';
import type {
  RequestResetPasswordRequest,
  VerifyResetCodeRequest,
  ResetPasswordRequest,
} from '../types/auth';

// 비밀번호 재설정 요청 Hook
export const useRequestResetPassword = () => {
  return useMutation<any, Error, RequestResetPasswordRequest>({
    mutationFn: requestResetPasswordApi,
    onSuccess: () => {
      console.log('✅ 비밀번호 재설정 요청 성공');
    },
    onError: error => {
      console.error('❌ 비밀번호 재설정 요청 실패:', error);
    },
  });
};

// 재설정 인증번호 확인 Hook
export const useVerifyResetCode = () => {
  return useMutation<any, Error, VerifyResetCodeRequest>({
    mutationFn: verifyResetCodeApi,
    onSuccess: () => {
      console.log('✅ 재설정 인증번호 확인 성공');
    },
    onError: error => {
      console.error('❌ 재설정 인증번호 확인 실패:', error);
    },
  });
};

// 새 비밀번호 설정 Hook
export const useResetPassword = () => {
  return useMutation<any, Error, ResetPasswordRequest>({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      console.log('✅ 새 비밀번호 설정 성공');
    },
    onError: error => {
      console.error('❌ 새 비밀번호 설정 실패:', error);
    },
  });
};
