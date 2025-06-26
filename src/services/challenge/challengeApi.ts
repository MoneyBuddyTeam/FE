import { axiosInstance } from '../api'; // 커스텀 axios 인스턴스
import { API_ENDPOINTS } from '../../config/api'; // API 경로 모음

// 챌린지 상세 조회
export const getChallengeDetail = async (id: number) => {
  const res = await axiosInstance.get(API_ENDPOINTS.challengeDetail(id));
  return res.data;
};

// 챌린지 참여하기
export const participateInChallenge = async (id: number) => {
  const res = await axiosInstance.post(API_ENDPOINTS.challengeParticipate(id));
  return res.data;
};

// 사용자 챌린지 참여 내역 조회
export const getUserChallengeParticipations = async (userId: number) => {
  const res = await axiosInstance.get(
    API_ENDPOINTS.userChallengeParticipations(userId),
  );
  return res.data;
};

// 특정 챌린지 참여 상세 조회
export const getChallengeParticipationDetail = async (id: number) => {
  const res = await axiosInstance.get(
    API_ENDPOINTS.challengeParticipationDetail(id),
  );
  return res.data;
};

// ✅ 미션 목록 조회 (챌린지 참여 ID 기준)
export const getMissionsByParticipation = async (participationId: number) => {
  const res = await axiosInstance.get(
    API_ENDPOINTS.missionsByParticipation(participationId),
  );
  return res.data;
};

export const uploadMissionProof = async (missionId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await axiosInstance.post(
    `/api/v1/missions/${missionId}/uploads`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
};

export const markMissionAsDone = async (missionId: number) => {
  return await axiosInstance.patch(`/api/v1/missions/${missionId}/status`, {
    status: 'DONE',
  });
};
