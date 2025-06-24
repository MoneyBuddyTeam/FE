import { http, HttpResponse } from 'msw';

// 임시 사용자 데이터베이스 (실제로는 서버 DB)
const users = [
  {
    id: 1,
    email: 'test@example.com',
    password: 'password123!', // 현재 테스트 비밀번호
    nickname: '테스트사용자',
    role: 'USER',
    profile_image: '/jpg/experts/expert1.png',
  },
  // 소셜 로그인 테스트 사용자들 추가
  {
    id: 2,
    email: 'kakao@example.com',
    password: '',
    nickname: '카카오사용자',
    role: 'USER',
    profile_image: '/jpg/experts/expert2.png',
    social_provider: 'kakao',
  },
  {
    id: 3,
    email: 'google@example.com',
    password: '',
    nickname: '구글사용자',
    role: 'USER',
    profile_image: '/jpg/experts/expert3.png',
    social_provider: 'google',
  },
  {
    id: 4,
    email: 'naver@example.com',
    password: '',
    nickname: '네이버사용자',
    role: 'USER',
    profile_image: '/jpg/experts/expert4.png',
    social_provider: 'naver',
  },
];

// 활성 토큰 저장소 (실제로는 Redis 등)
const activeTokens = new Set<string>();

// 액세스 토큰 생성 함수 (실제로는 JWT)
const generateAccessToken = (userId: number) => {
  const token = `mock_access_token_${userId}_${Date.now()}`;
  activeTokens.add(token);
  return token;
};

// 리프레시 토큰 생성 함수
const generateRefreshToken = (userId: number) => {
  return `mock_refresh_token_${userId}_${Date.now()}`;
};

// 토큰 유효성 검증 함수
const validateToken = (token: string | undefined): boolean => {
  if (!token) return false;
  const cleanToken = token.replace('Bearer ', '');
  // MSW 환경에서는 mock_access_token으로 시작하는 토큰을 유효한 것으로 간주
  return (
    cleanToken.startsWith('mock_access_token_') || activeTokens.has(cleanToken)
  );
};

// 토큰에서 사용자 ID 추출
const getUserIdFromToken = (token: string) => {
  const cleanToken = token.replace('Bearer ', '');
  const payload = cleanToken.split('_');
  return parseInt(payload[2], 10);
};

export const authHandlers = [
  // 로그인 (POST /api/v1/users/login)
  http.post('/api/v1/users/login', async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };

    console.log('🔐 MSW: 로그인 시도', { email });

    // 사용자 찾기
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      console.log('❌ MSW: 로그인 실패 - 잘못된 인증 정보');
      return new HttpResponse('이메일 또는 비밀번호가 잘못되었습니다.', {
        status: 401,
      });
    }

    // 토큰 생성
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    console.log('✅ MSW: 로그인 성공', { userId: user.id });

    // 명세서에 따른 응답 형식 (Map 형식)
    const response = new HttpResponse(
      JSON.stringify({
        token: accessToken,
        email: user.email,
        nickname: user.nickname,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          // 명세서에 따라 httpOnly 쿠키로 토큰 발급
          'Set-Cookie': [
            `token=${accessToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`,
            `refresh_token=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`,
          ].join(', '),
        },
      },
    );

    return response;
  }),

  // 회원가입 (POST /api/v1/users)
  http.post('/api/v1/users', async ({ request }) => {
    const { email, password, nickname } = (await request.json()) as {
      email: string;
      password: string;
      nickname: string;
    };

    console.log('📝 MSW: 회원가입 시도', { email, nickname }); // 이메일 중복 체크
    if (users.find(u => u.email === email)) {
      console.log('❌ MSW: 회원가입 실패 - 이메일 중복');
      return new HttpResponse('이미 사용 중인 이메일입니다.', { status: 409 });
    }

    // 닉네임 중복 체크
    if (users.find(u => u.nickname === nickname)) {
      console.log('❌ MSW: 회원가입 실패 - 닉네임 중복');
      return new HttpResponse('이미 사용 중인 닉네임입니다.', { status: 409 });
    }

    // 새 사용자 생성
    const newUser = {
      id: users.length + 1,
      email,
      password, // 실제로는 해시 처리
      nickname,
      role: 'USER' as const,
      profile_image: '/jpg/experts/expert1.png',
    };

    users.push(newUser);

    // 토큰 생성
    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

    console.log('✅ MSW: 회원가입 성공', { userId: newUser.id });

    return HttpResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        nickname: newUser.nickname,
        role: newUser.role,
        profile_image: newUser.profile_image,
      },
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
  }),

  // 카카오 로그인
  http.post('/api/v1/auth/kakao', async ({ request }) => {
    const { authCode } = (await request.json()) as { authCode: string };

    console.log('🔐 MSW: 카카오 로그인 시도', { authCode });

    // MSW에서는 authCode가 있으면 성공으로 처리
    if (authCode) {
      const user = users.find(u => u.social_provider === 'kakao');
      const accessToken = generateAccessToken(user!.id);
      const refreshToken = generateRefreshToken(user!.id);

      console.log('✅ MSW: 카카오 로그인 성공', { userId: user!.id });

      return HttpResponse.json({
        user: {
          id: user!.id,
          email: user!.email,
          nickname: user!.nickname,
          role: user!.role,
          profile_image: user!.profile_image,
        },
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      });
    }
    return new HttpResponse('카카오 로그인에 실패했습니다.', { status: 401 });
  }),

  // 구글 로그인
  http.post('/api/v1/auth/google', async ({ request }) => {
    const { authCode } = (await request.json()) as { authCode: string };

    console.log('🔐 MSW: 구글 로그인 시도', { authCode });

    if (authCode) {
      const user = users.find(u => u.social_provider === 'google');
      const accessToken = generateAccessToken(user!.id);
      const refreshToken = generateRefreshToken(user!.id);

      console.log('✅ MSW: 구글 로그인 성공', { userId: user!.id });

      return HttpResponse.json({
        user: {
          id: user!.id,
          email: user!.email,
          nickname: user!.nickname,
          role: user!.role,
          profile_image: user!.profile_image,
        },
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      });
    }
    return new HttpResponse('구글 로그인에 실패했습니다.', { status: 401 });
  }),

  // 네이버 로그인
  http.post('/api/v1/auth/naver', async ({ request }) => {
    const { authCode } = (await request.json()) as { authCode: string };

    console.log('🔐 MSW: 네이버 로그인 시도', { authCode });

    if (authCode) {
      const user = users.find(u => u.social_provider === 'naver');
      const accessToken = generateAccessToken(user!.id);
      const refreshToken = generateRefreshToken(user!.id);

      console.log('✅ MSW: 네이버 로그인 성공', { userId: user!.id });

      return HttpResponse.json({
        user: {
          id: user!.id,
          email: user!.email,
          nickname: user!.nickname,
          role: user!.role,
          profile_image: user!.profile_image,
        },
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      });
    }
    return new HttpResponse('네이버 로그인에 실패했습니다.', { status: 401 });
  }),
  // OAuth2 소셜 연동 해제
  http.delete('/api/v1/auth/unlink', async ({ request }) => {
    console.log('🔗 MSW: 소셜 연동 해제 시도'); // 헤더에서 토큰 확인
    const authHeader = request.headers.get('Authorization');

    if (!validateToken(authHeader || undefined)) {
      console.log('❌ MSW: 인증되지 않은 사용자 - 소셜 연동 해제');
      return new HttpResponse('인증이 필요합니다.', { status: 401 });
    }

    const userId = getUserIdFromToken(authHeader!);
    console.log('✅ MSW: 소셜 연동 해제 성공', { userId });

    return new HttpResponse('소셜 연동이 해제되었습니다.', { status: 200 });
  }),

  // Access Token 재발급 (POST /api/v1/auth/refresh)
  http.post('/api/v1/auth/refresh', ({ request }) => {
    console.log('🔄 MSW: Access Token 재발급 시도');

    // 쿠키에서 refresh_token 확인
    const cookieHeader = request.headers.get('Cookie');
    const hasRefreshToken = cookieHeader?.includes('refresh_token=');

    if (!hasRefreshToken) {
      console.log('❌ MSW: Refresh Token 누락됨');
      return new HttpResponse('Refresh Token이 누락되었습니다.', {
        status: 401,
      });
    }

    // 새로운 액세스 토큰 생성
    const newAccessToken = generateAccessToken(1);

    console.log('✅ MSW: Access Token 재발급 성공');

    return new HttpResponse('Access Token 재발급 완료', {
      status: 200,
      headers: {
        'Set-Cookie': `token=${newAccessToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`,
      },
    });
  }),

  // 로그아웃 (POST /api/v1/auth/logout)
  http.post('/api/v1/auth/logout', ({ request }) => {
    console.log('🚪 MSW: 로그아웃 시도');

    // 헤더에서 인증 확인
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse('인증이 필요합니다.', { status: 401 });
    }

    console.log('✅ MSW: 로그아웃 성공');

    // 명세서에 따라 Refresh Token 삭제 및 Access Token 쿠키 제거
    return new HttpResponse('로그아웃 완료', {
      status: 200,
      headers: {
        'Set-Cookie': [
          'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict',
          'refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict',
        ].join(', '),
      },
    });
  }), // 비밀번호 변경 API - 올바른 엔드포인트로 수정
  http.patch('/api/v1/auth/change-password', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 체크
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ MSW: 비밀번호 변경 - 인증되지 않은 사용자');
      return HttpResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    // 간단한 토큰 검증
    const token = authHeader.replace('Bearer ', '');
    if (!token.startsWith('mock_access_token_')) {
      console.log('❌ MSW: 비밀번호 변경 - 유효하지 않은 토큰');
      return HttpResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    const { currentPassword, newPassword } = (await request.json()) as {
      currentPassword: string;
      newPassword: string;
    };

    console.log('🔑 MSW: 비밀번호 변경 요청'); // 현재 비밀번호 확인 (실제로는 해시 비교)
    if (currentPassword !== 'password123!') {
      console.log('❌ MSW: 현재 비밀번호가 일치하지 않음');
      return HttpResponse.json(
        { message: '틀린 비밀번호 입니다. 다시 입력해주세요.' },
        { status: 400 },
      );
    }

    // 새 비밀번호 유효성 검사
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{10,}$/;
    if (!passwordRegex.test(newPassword)) {
      console.log('❌ MSW: 비밀번호 변경 실패 - 유효하지 않은 새 비밀번호');
      return HttpResponse.json(
        {
          message:
            '비밀번호는 영문, 숫자, 특수문자 포함 10자 이상이어야 합니다.',
        },
        { status: 400 },
      );
    }

    console.log('✅ MSW: 비밀번호 변경 성공');
    return HttpResponse.json({
      message: '비밀번호가 성공적으로 변경되었습니다.',
    });
  }),

  // 아이디 찾기
  http.post('/api/v1/users/find-id', async ({ request }) => {
    const { name, phone } = (await request.json()) as {
      name: string;
      phone: string;
    };

    console.log('🔍 MSW: 아이디 찾기 요청', { name, phone });

    // 간단한 검증 (실제로는 DB 조회)
    if (name === '테스트' && phone === '010-1234-5678') {
      console.log('✅ MSW: 아이디 찾기 성공');
      return HttpResponse.json({
        email: 'test@example.com',
        message: '아이디를 찾았습니다.',
      });
    }

    console.log('❌ MSW: 아이디 찾기 실패 - 일치하는 정보 없음');
    return HttpResponse.json(
      { message: '일치하는 사용자 정보를 찾을 수 없습니다.' },
      { status: 404 },
    );
  }),

  // 비밀번호 재설정
  http.post('/api/v1/users/reset-password', async ({ request }) => {
    const { email, name, phone } = (await request.json()) as {
      email: string;
      name: string;
      phone: string;
    };

    console.log('🔒 MSW: 비밀번호 재설정 요청', { email, name, phone });

    // 간단한 검증
    if (
      email === 'test@example.com' &&
      name === '테스트' &&
      phone === '010-1234-5678'
    ) {
      console.log('✅ MSW: 비밀번호 재설정 성공');
      return HttpResponse.json({
        message: '임시 비밀번호가 전송되었습니다.',
        tempPassword: 'temp123456',
      });
    }

    console.log('❌ MSW: 비밀번호 재설정 실패 - 일치하는 정보 없음');
    return HttpResponse.json(
      { message: '일치하는 사용자 정보를 찾을 수 없습니다.' },
      { status: 404 },
    );
  }),

  // 사용자 설정 조회
  http.get('/api/v1/users/:user_id/settings', ({ params }) => {
    const { user_id } = params;
    console.log('⚙️ MSW: 사용자 설정 조회', { user_id });

    return HttpResponse.json({
      notificationEnabled: true,
      privacyLevel: 'PUBLIC',
    });
  }),

  // 사용자 설정 수정
  http.put('/api/v1/users/:user_id/settings', async ({ params, request }) => {
    const { user_id } = params;
    const body = (await request.json()) as Record<string, unknown>;
    console.log('⚙️ MSW: 사용자 설정 수정', { user_id, settings: body });

    return HttpResponse.json({
      ...body,
      message: '설정이 성공적으로 변경되었습니다.',
    });
  }),

  // 비밀번호 확인 API
  http.post('/api/v1/auth/verify-password', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 체크
    if (!validateToken(authHeader?.replace('Bearer ', ''))) {
      console.log('❌ MSW: 비밀번호 확인 - 인증되지 않은 사용자');
      return HttpResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    const { password } = (await request.json()) as { password: string };
    console.log('🔑 MSW: 비밀번호 확인 요청');

    // 현재 비밀번호 확인 (실제로는 해시 비교)
    if (password !== 'password123') {
      console.log('❌ MSW: 비밀번호가 일치하지 않음');
      return HttpResponse.json(
        { message: '비밀번호가 일치하지 않습니다.' },
        { status: 400 },
      );
    }

    console.log('✅ MSW: 비밀번호 확인 성공');
    return HttpResponse.json({
      message: '비밀번호가 확인되었습니다.',
    });
  }),
];
