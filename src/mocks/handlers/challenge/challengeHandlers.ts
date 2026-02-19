import { http, HttpResponse } from 'msw';
import { validateToken } from '../auth/constants';

// Mock 챌린지 데이터
const mockChallenges = [
  {
    id: 1,
    title: '30일 소비 기록 챌린지',
    description: '매일 소비 내용을 기록하고 검토하는 습관 만들기',
    createdAt: '2025-06-19T12:00:00',
  },
  {
    id: 2,
    title: '가계부 작성 챌린지',
    description: '체계적인 가계부 작성으로 지출 관리하기',
    createdAt: '2025-06-18T10:00:00',
  },
];

// Mock 챌린지 참여 데이터
const mockParticipations = [
  {
    id: 101,
    userId: 1,
    challengeId: 1,
    challengeTitle: '30일 소비 기록 챌린지',
    status: 'progress',
    participatedAt: '2025-06-19T13:00:00',
    startDate: '2025-06-19',
    endDate: '2025-07-19',
    completedMissions: 15,
    totalMissions: 30,
  },
  {
    id: 102,
    userId: 1,
    challengeId: 2,
    challengeTitle: '가계부 작성 챌린지',
    status: 'completed',
    participatedAt: '2025-05-01T09:00:00',
    startDate: '2025-05-01',
    endDate: '2025-05-31',
    completedMissions: 31,
    totalMissions: 31,
  },
];

// Mock 미션 데이터
const mockMissions = [
  {
    id: 201,
    title: '하루 소비 내역 정리',
    content: '오늘의 모든 소비를 기록하세요.',
    status: 'COMPLETED',
    participationId: 101,
    advisorId: 5,
    createdAt: '2025-06-19T15:00:00',
  },
  {
    id: 202,
    title: '주간 지출 분석',
    content: '이번 주 지출 패턴을 분석해보세요.',
    status: 'PENDING',
    participationId: 101,
    advisorId: 5,
    createdAt: '2025-06-20T09:00:00',
  },
];

export const challengeHandlers = [
  // 1. 챌린지 생성 (ADMIN, ADVISOR)
  http.post('/api/v1/challenges', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!validateToken(authHeader)) {
      console.log('❌ MSW: 인증되지 않은 사용자 - POST /challenges');
      return HttpResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    try {
      const { title, description } = (await request.json()) as {
        title: string;
        description: string;
      };

      const newChallenge = {
        id: mockChallenges.length + 1,
        title,
        description,
        createdAt: new Date().toISOString(),
      };

      mockChallenges.push(newChallenge);
      console.log('✅ MSW: 챌린지 생성 성공:', newChallenge);

      return HttpResponse.json(newChallenge);
    } catch (error) {
      console.error('❌ MSW: 챌린지 생성 중 오류:', error);
      return HttpResponse.json(
        { message: '잘못된 요청 형식입니다.' },
        { status: 400 },
      );
    }
  }),

  // 2. 챌린지 전체 조회
  http.get('/api/v1/challenges', () => {
    console.log('✅ MSW: 챌린지 전체 조회 성공');
    return HttpResponse.json(mockChallenges);
  }),

  // 3. 챌린지 상세 조회
  http.get('/api/v1/challenges/:id', ({ params }) => {
    const challengeId = Number(params.id);
    const challenge = mockChallenges.find(c => c.id === challengeId);

    if (!challenge) {
      console.log(`❌ MSW: 챌린지를 찾을 수 없음 - ID: ${challengeId}`);
      return HttpResponse.json(
        { message: '챌린지를 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    console.log(`✅ MSW: 챌린지 상세 조회 성공 - ID: ${challengeId}`);
    return HttpResponse.json(challenge);
  }),

  // 4. 챌린지 참여 (USER)
  http.post(
    '/api/v1/challenges/:challengeId/participate',
    async ({ params, request }) => {
      const authHeader = request.headers.get('Authorization');

      if (!validateToken(authHeader)) {
        console.log(
          '❌ MSW: 인증되지 않은 사용자 - POST /challenges/:challengeId/participate',
        );
        return HttpResponse.json(
          { message: '인증이 필요합니다.' },
          { status: 401 },
        );
      }

      const challengeId = Number(params.challengeId);
      const challenge = mockChallenges.find(c => c.id === challengeId);

      if (!challenge) {
        return HttpResponse.json(
          { message: '챌린지를 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      const newParticipation = {
        id: mockParticipations.length + 101,
        userId: 1, // 현재 로그인된 사용자 ID
        challengeId,
        challengeTitle: challenge.title,
        status: 'progress',
        participatedAt: new Date().toISOString(),
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        completedMissions: 0,
        totalMissions: 30,
      };

      mockParticipations.push(newParticipation);
      console.log('✅ MSW: 챌린지 참여 성공:', newParticipation);

      return HttpResponse.json(newParticipation);
    },
  ),

  // 5. 사용자 참여 내역 조회
  http.get(
    '/api/v1/users/:userId/challenge-participations',
    ({ params, request }) => {
      const authHeader = request.headers.get('Authorization');

      if (!validateToken(authHeader)) {
        console.log(
          '❌ MSW: 인증되지 않은 사용자 - GET /users/:userId/challenge-participations',
        );
        return HttpResponse.json(
          { message: '인증이 필요합니다.' },
          { status: 401 },
        );
      }

      const userId = Number(params.userId);
      const userParticipations = mockParticipations.filter(
        p => p.userId === userId,
      );

      console.log(`✅ MSW: 사용자 참여 내역 조회 성공 - User ID: ${userId}`);
      return HttpResponse.json(userParticipations);
    },
  ),

  // 6. 특정 참여 상세 조회
  http.get('/api/v1/challenge-participations/:id', ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!validateToken(authHeader)) {
      console.log(
        '❌ MSW: 인증되지 않은 사용자 - GET /challenge-participations/:id',
      );
      return HttpResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    const participationId = Number(params.id);
    const participation = mockParticipations.find(
      p => p.id === participationId,
    );

    if (!participation) {
      console.log(`❌ MSW: 참여 내역을 찾을 수 없음 - ID: ${participationId}`);
      return HttpResponse.json(
        { message: '참여 내역을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    console.log(`✅ MSW: 참여 상세 조회 성공 - ID: ${participationId}`);
    return HttpResponse.json(participation);
  }),

  // 미션 관련 핸들러들

  // 1. 미션 생성 (ADMIN, ADVISOR)
  http.post(
    '/api/v1/admin/challenge-participations/:participationId/missions',
    async ({ params, request }) => {
      const authHeader = request.headers.get('Authorization');

      if (!validateToken(authHeader)) {
        console.log(
          '❌ MSW: 인증되지 않은 사용자 - POST /admin/challenge-participations/:participationId/missions',
        );
        return HttpResponse.json(
          { message: '인증이 필요합니다.' },
          { status: 401 },
        );
      }

      try {
        const { title, content, advisorId } = (await request.json()) as {
          title: string;
          content: string;
          advisorId: number;
        };

        const participationId = Number(params.participationId);

        const newMission = {
          id: mockMissions.length + 201,
          title,
          content,
          status: 'PENDING',
          participationId,
          advisorId,
          createdAt: new Date().toISOString(),
        };

        mockMissions.push(newMission);
        console.log('✅ MSW: 미션 생성 성공:', newMission);

        return HttpResponse.json(newMission);
      } catch (error) {
        console.error('❌ MSW: 미션 생성 중 오류:', error);
        return HttpResponse.json(
          { message: '잘못된 요청 형식입니다.' },
          { status: 400 },
        );
      }
    },
  ),

  // 2. 미션 목록 조회
  http.get(
    '/api/v1/challenge-participations/:participationId/missions',
    ({ params, request }) => {
      const authHeader = request.headers.get('Authorization');

      if (!validateToken(authHeader)) {
        console.log(
          '❌ MSW: 인증되지 않은 사용자 - GET /challenge-participations/:participationId/missions',
        );
        return HttpResponse.json(
          { message: '인증이 필요합니다.' },
          { status: 401 },
        );
      }

      const participationId = Number(params.participationId);
      const participationMissions = mockMissions.filter(
        m => m.participationId === participationId,
      );

      console.log(
        `✅ MSW: 미션 목록 조회 성공 - Participation ID: ${participationId}`,
      );
      return HttpResponse.json(participationMissions);
    },
  ),

  // 3. 미션 상세 조회
  http.get('/api/v1/missions/:id', ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!validateToken(authHeader)) {
      console.log('❌ MSW: 인증되지 않은 사용자 - GET /missions/:id');
      return HttpResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    const missionId = Number(params.id);
    const mission = mockMissions.find(m => m.id === missionId);

    if (!mission) {
      console.log(`❌ MSW: 미션을 찾을 수 없음 - ID: ${missionId}`);
      return HttpResponse.json(
        { message: '미션을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    console.log(`✅ MSW: 미션 상세 조회 성공 - ID: ${missionId}`);
    return HttpResponse.json(mission);
  }),

  // 4. 미션 상태 변경
  http.patch('/api/v1/missions/:id/status', async ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!validateToken(authHeader)) {
      console.log('❌ MSW: 인증되지 않은 사용자 - PATCH /missions/:id/status');
      return HttpResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    try {
      const { status } = (await request.json()) as { status: string };
      const missionId = Number(params.id);
      const mission = mockMissions.find(m => m.id === missionId);

      if (!mission) {
        return HttpResponse.json(
          { message: '미션을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      mission.status = status;
      console.log(
        `✅ MSW: 미션 상태 변경 성공 - ID: ${missionId}, Status: ${status}`,
      );

      return HttpResponse.json(mission);
    } catch (error) {
      console.error('❌ MSW: 미션 상태 변경 중 오류:', error);
      return HttpResponse.json(
        { message: '잘못된 요청 형식입니다.' },
        { status: 400 },
      );
    }
  }),
];
