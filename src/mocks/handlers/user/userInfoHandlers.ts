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
  // 로그인 시 생성되는 토큰 패턴과 일치하는지 확인
  return token.includes('mock_login_access_token_');
};

// 토큰에서 사용자 ID 추출
const getUserIdFromToken = (authHeader: string): number => {
  const token = authHeader.replace('Bearer ', '');
  // 토큰에서 숫자 추출 (예: mock_login_access_token_1750768887356에서 1을 추출)
  return 1; // 테스트를 위해 기본값 1 반환
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

    console.log('✅ MSW: 사용자 정보 조회 성공 - Authorization:', authHeader);

    return HttpResponse.json({
      id: 1,
      nickname: mockUser.nickname,
      email: mockUser.email,
      role: mockUser.role,
      profile_image: mockUser.profile_image,
    });
  }),

  // 사용자 정보 업데이트 - 인증 필요
  http.put('/api/v1/users/:id', async ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log(
      '🔍 MSW: PUT /users/:id - 받은 Authorization 헤더:',
      authHeader,
    );

    // 토큰 검증
    if (!validateToken(authHeader)) {
      console.log('❌ MSW: 인증되지 않은 사용자 - PUT /users/:id');
      return HttpResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    try {
      const data = (await request.json()) as {
        nickname?: string;
        profile_image?: string;
        currentPassword?: string;
        newPassword?: string;
      };
      console.log('✅ MSW: 사용자 정보 업데이트 요청 데이터:', data);

      // 비밀번호 변경 요청인 경우
      if (data.currentPassword && data.newPassword) {
        // 현재 비밀번호 검증
        if (data.currentPassword !== 'password123!') {
          return HttpResponse.json(
            { message: '현재 비밀번호가 일치하지 않습니다.' },
            { status: 400 },
          );
        }

        // 새 비밀번호 유효성 검사 (최소 10자, 영문/숫자/특수문자 포함)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{10,}$/;
        if (!passwordRegex.test(data.newPassword)) {
          return HttpResponse.json(
            {
              message:
                '새 비밀번호는 10자 이상이며, 영문, 숫자, 특수문자를 포함해야 합니다.',
            },
            { status: 400 },
          );
        }

        // 이전 비밀번호와 동일한 경우
        if (data.newPassword === data.currentPassword) {
          return HttpResponse.json(
            { message: '새 비밀번호가 현재 비밀번호와 동일합니다.' },
            { status: 400 },
          );
        }

        console.log('✅ MSW: 비밀번호 변경 성공');
        return HttpResponse.json({
          id: parseInt(params.id as string),
          ...mockUser,
          message: '비밀번호가 성공적으로 변경되었습니다.',
        });
      }

      // 일반 사용자 정보 업데이트
      if (!data?.nickname) {
        return HttpResponse.json(
          { message: '닉네임은 필수 입력값입니다.' },
          { status: 400 },
        );
      }

      // mockUser 정보 업데이트
      mockUser.nickname = data.nickname;
      if (data.profile_image) {
        mockUser.profile_image = data.profile_image;
      }

      return HttpResponse.json({
        id: parseInt(params.id as string),
        ...mockUser,
      });
    } catch (error) {
      console.error('❌ MSW: 사용자 정보 업데이트 중 오류:', error);
      return HttpResponse.json(
        { message: '잘못된 요청 형식입니다.' },
        { status: 400 },
      );
    }
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
