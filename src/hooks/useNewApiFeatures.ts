import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPublicProfile,
  recoverUserAccount,
  refreshTokenApi,
  updateConsultationStatusApi,
  createChallengeAdmin,
} from '../services';
import type {
  PublicProfileResponse,
  RecoverAccountRequest,
  UpdateConsultationStatusRequest,
  CreateChallengeRequest,
} from '../types/auth';

// 공개 프로필 조회 훅
export const usePublicProfile = () => {
  return useMutation({
    mutationFn: (userId: number) => getPublicProfile(userId),
    onSuccess: (data: PublicProfileResponse) => {
      console.log('✅ 공개 프로필 조회 성공:', data);
    },
    onError: error => {
      console.error('❌ 공개 프로필 조회 실패:', error);
    },
  });
};

// 계정 복구 훅
export const useRecoverAccount = () => {
  return useMutation({
    mutationFn: (data: RecoverAccountRequest) => recoverUserAccount(data),
    onSuccess: data => {
      console.log('✅ 계정 복구 성공:', data);
    },
    onError: error => {
      console.error('❌ 계정 복구 실패:', error);
    },
  });
};

// 토큰 재발급 훅
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: refreshTokenApi,
    onSuccess: data => {
      console.log('✅ 토큰 재발급 성공:', data);
    },
    onError: error => {
      console.error('❌ 토큰 재발급 실패:', error);
    },
  });
};

// 상담 상태 변경 훅
export const useUpdateConsultationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      statusData,
    }: {
      roomId: number;
      statusData: UpdateConsultationStatusRequest;
    }) => updateConsultationStatusApi(roomId, statusData),
    onSuccess: (_, variables) => {
      console.log('✅ 상담 상태 변경 성공');
      // 상담 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['consultation', variables.roomId],
      });
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
    },
    onError: error => {
      console.error('❌ 상담 상태 변경 실패:', error);
    },
  });
};

// 챌린지 생성 훅
export const useCreateChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (challengeData: CreateChallengeRequest) =>
      createChallengeAdmin(challengeData),
    onSuccess: data => {
      console.log('✅ 챌린지 생성 성공:', data);
      // 챌린지 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
    onError: error => {
      console.error('❌ 챌린지 생성 실패:', error);
    },
  });
};
