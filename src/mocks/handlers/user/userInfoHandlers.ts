import { http, HttpResponse } from 'msw';

const mockUser = {
  nickname: '테스트사용자',
  email: 'test@example.com',
  role: 'USER',
  profile_image: '/jpg/experts/expert1.png',
};

// 토큰 유효성 검증 함수
const validateToken = (authHeader: string | null): boolean => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.replace('Bearer ', '');
  // 간단한 토큰 검증 (실제로는 JWT 검증)
  return token.startsWith('mock_access_token_');
};

// 토큰에서 사용자 ID 추출
const getUserIdFromToken = (authHeader: string): number => {
  const token = authHeader.replace('Bearer ', '');
  const match = token.match(/mock_access_token_(\d+)_/);
  return match ? parseInt(match[1]) : 1;
};

export const userInfoHandlers = [
  // 현재 사용자 정보 조회 - 인증 필요
  http.get('/api/v1/users/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 토큰 검증
    if (!validateToken(authHeader)) {
      console.log('❌ MSW: 인증되지 않은 사용자 - /users/me');
      return HttpResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    const userId = getUserIdFromToken(authHeader!);
    console.log('✅ MSW: 사용자 정보 조회 성공 - ID:', userId);

    return HttpResponse.json({
      id: userId,
      nickname: mockUser.nickname,
      email: mockUser.email,
      role: mockUser.role,
      profile_image: mockUser.profile_image,
    });
  }), // 사용자 정보 업데이트 - 인증 필요
  http.put('/api/v1/users/:id', async ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');

    // 토큰 검증
    if (!validateToken(authHeader)) {
      console.log('❌ MSW: 인증되지 않은 사용자 - PUT /users/:id');
      return HttpResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    const requestUserId = Number(params.id);
    const tokenUserId = getUserIdFromToken(authHeader!);

    console.log(
      '🔄 MSW: 닉네임 변경 요청 - requestUserId:',
      requestUserId,
      'tokenUserId:',
      tokenUserId,
    );

    const body = (await request.json()) as {
      nickname?: string;
      profile_image?: string;
    };

    console.log('🔄 MSW: 사용자 정보 업데이트 요청', { requestUserId, body });

    // 닉네임 중복 체크 시뮬레이션 (테스트용 중복 닉네임 제외)
    if (body.nickname && body.nickname === '중복닉네임') {
      console.log('❌ MSW: 닉네임 중복');
      return HttpResponse.json(
        { message: '이미 사용 중인 닉네임입니다.' },
        { status: 409 },
      );
    }

    // 성공 응답 - 업데이트된 전체 사용자 정보 반환
    const updatedUser = {
      id: requestUserId,
      nickname: body.nickname || mockUser.nickname,
      profile_image: body.profile_image || mockUser.profile_image,
      email: mockUser.email,
      role: mockUser.role,
    };

    console.log('✅ MSW: 사용자 정보 업데이트 성공', updatedUser);

    // mockUser 업데이트하여 다음 요청에서도 변경된 닉네임 반영
    if (body.nickname) {
      mockUser.nickname = body.nickname;
    }

    return HttpResponse.json(updatedUser);
  }),

  // 사용자 포인트 조회 - 인증 필요
  http.get('/api/v1/users/points', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 토큰 검증
    if (!validateToken(authHeader)) {
      console.log('❌ MSW: 인증되지 않은 사용자 - /users/points');
      return HttpResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    const userId = getUserIdFromToken(authHeader!);
    console.log('✅ MSW: 포인트 조회 성공 - ID:', userId);

    return HttpResponse.json({
      availablePoints: 2000,
      totalEarned: 5000,
      totalUsed: 3000,
    });
  }),

  // 공개 프로필 조회 (GET /api/v1/users/{id}/profile)
  http.get('/api/v1/users/:id/profile', ({ params }) => {
    const userId = Number(params.id);
    console.log(`👤 MSW: 공개 프로필 조회 - User ID: ${userId}`);

    const mockProfile = {
      userId: userId,
      nickname: `사용자${userId}`,
      profileImage: `/jpg/experts/expert${(userId % 5) + 1}.png`,
    };

    console.log('✅ MSW: 공개 프로필 조회 성공');
    return HttpResponse.json(mockProfile);
  }),

  // 탈퇴 계정 복구 (POST /api/v1/users/recover)
  http.post('/api/v1/users/recover', async ({ request }) => {
    const { email } = (await request.json()) as { email: string };
    console.log(`🔄 MSW: 탈퇴 계정 복구 시도 - Email: ${email}`);

    // 실제로는 탈퇴 후 30일 이내 계정 확인
    const recoveredUser = {
      id: 999,
      email: email,
      nickname: '복구된사용자',
      phone: '010-1234-5678',
      profileImage: '/jpg/experts/expert1.png',
      role: 'USER',
      loginMethod: 'EMAIL',
    };

    console.log('✅ MSW: 탈퇴 계정 복구 성공');
    return HttpResponse.json(recoveredUser);
  }),
];
