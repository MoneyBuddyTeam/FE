import { http, HttpResponse } from 'msw';
import { validateToken, MOCK_USER } from '../auth/constants';

// 토큰에서 사용자 ID 추출
const getUserIdFromToken = (): number => {
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
      nickname: MOCK_USER.nickname,
      email: MOCK_USER.email,
      role: MOCK_USER.role,
      profile_image: MOCK_USER.profile_image,
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
          ...MOCK_USER,
          id: parseInt(params.id as string),
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

      // 업데이트된 사용자 정보 생성
      const updatedUser = {
        ...MOCK_USER,
        id: parseInt(params.id as string),
        nickname: data.nickname,
        ...(data.profile_image && { profile_image: data.profile_image }),
      };

      return HttpResponse.json(updatedUser);
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

    const userId = getUserIdFromToken();
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

  // 프로필 이미지 업로드 (POST /api/v1/users/profile-image)
  http.post('/api/v1/users/profile-image', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 토큰 검증
    if (!validateToken(authHeader)) {
      console.log('❌ MSW: 인증되지 않은 사용자 - /users/profile-image');
      return HttpResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return HttpResponse.json(
          { message: '이미지 파일이 필요합니다.' },
          { status: 400 },
        );
      }

      // 파일 크기 검증 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        return HttpResponse.json(
          { message: '파일 크기는 5MB 이하여야 합니다.' },
          { status: 400 },
        );
      }

      // 파일 형식 검증
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        return HttpResponse.json(
          { message: '지원하지 않는 파일 형식입니다. (JPEG, PNG만 허용)' },
          { status: 400 },
        );
      }

      // 가상의 이미지 URL 생성
      const imageUrl = `https://cdn.moneybuddy.com/profiles/${Date.now()}_${file.name}`;

      console.log('✅ MSW: 프로필 이미지 업로드 성공:', imageUrl);

      return HttpResponse.json({
        imageUrl: imageUrl,
        message: '프로필 이미지가 성공적으로 업로드되었습니다.',
      });
    } catch (error) {
      console.error('❌ MSW: 프로필 이미지 업로드 중 오류:', error);
      return HttpResponse.json(
        { message: '이미지 업로드에 실패했습니다.' },
        { status: 500 },
      );
    }
  }),
];
