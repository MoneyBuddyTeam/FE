import { http, HttpResponse } from 'msw';

export const authPasswordHandlers = [
  // 이메일 중복 확인 API (명세서: GET /api/v1/auth/check-email)
  http.get('/api/v1/auth/check-email', ({ request }) => {
    try {
      const url = new URL(request.url);
      const email = url.searchParams.get('email');
      console.log('📧 MSW: 이메일 중복 확인:', email);

      // 테스트용: test@example.com은 중복된 이메일로 처리
      if (email === 'test@example.com') {
        return HttpResponse.json(
          { available: false, message: '이미 사용중인 이메일입니다.' },
          { status: 409 },
        );
      }

      return HttpResponse.json({
        available: true,
        message: '사용 가능한 이메일입니다.',
      });
    } catch (error) {
      console.error('❌ MSW - 이메일 중복 확인 오류:', error);
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  }),

  // 닉네임 중복 확인 API (명세서: GET /api/v1/auth/check-nickname)
  http.get('/api/v1/auth/check-nickname', ({ request }) => {
    try {
      const url = new URL(request.url);
      const nickname = url.searchParams.get('nickname');
      console.log('👤 MSW: 닉네임 중복 확인:', nickname);

      // 테스트용: testuser는 중복된 닉네임으로 처리
      if (nickname === 'testuser') {
        return HttpResponse.json(
          { available: false, message: '이미 사용중인 닉네임입니다.' },
          { status: 409 },
        );
      }

      return HttpResponse.json({
        available: true,
        message: '사용 가능한 닉네임입니다.',
      });
    } catch (error) {
      console.error('❌ MSW - 닉네임 중복 확인 오류:', error);
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  }),

  // 인증번호 발송 API (명세서: POST /api/v1/auth/send-verification)
  http.post('/api/v1/auth/send-verification', async ({ request }) => {
    try {
      const data = (await request.json()) as { email: string };
      console.log('📨 MSW: 인증번호 발송:', data.email);

      return HttpResponse.json({
        message: '인증번호가 이메일로 발송되었습니다.',
        expires_in: 300, // 5분
      });
    } catch (error) {
      console.error('❌ MSW - 인증번호 발송 오류:', error);
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  }),

  // 인증번호 확인 API (명세서: POST /api/v1/auth/verify-code)
  http.post('/api/v1/auth/verify-code', async ({ request }) => {
    try {
      const data = (await request.json()) as { email: string; code: string };
      console.log('🔢 MSW: 인증번호 확인:', data);

      // 테스트용 인증번호: 123456
      if (data.code === '123456') {
        return HttpResponse.json({
          verified: true,
          message: '인증번호가 확인되었습니다.',
        });
      }

      return HttpResponse.json(
        { verified: false, message: '잘못된 인증번호입니다.' },
        { status: 400 },
      );
    } catch (error) {
      console.error('❌ MSW - 인증번호 확인 오류:', error);
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  }),

  // 비밀번호 재설정 요청 API (명세서: POST /api/v1/auth/password-reset/request)
  http.post('/api/v1/auth/password-reset/request', async ({ request }) => {
    try {
      const data = (await request.json()) as { email: string };
      console.log('📧 MSW: 비밀번호 재설정 요청:', { email: data.email });

      if (!data.email) {
        return HttpResponse.json(
          { message: '이메일이 필요합니다.' },
          { status: 400 },
        );
      }

      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return HttpResponse.json(
          { message: '올바른 이메일 형식이 아닙니다.' },
          { status: 400 },
        );
      }

      return HttpResponse.json({
        message: '비밀번호 재설정 코드가 이메일로 발송되었습니다.',
        expires_in: 300, // 5분
      });
    } catch (error) {
      console.error('❌ MSW - 비밀번호 재설정 요청 오류:', error);
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  }),

  // 비밀번호 재설정 코드 확인 API (명세서: POST /api/v1/auth/password-reset/verify)
  http.post('/api/v1/auth/password-reset/verify', async ({ request }) => {
    try {
      const data = (await request.json()) as { email: string; code: string };
      console.log('🔐 MSW: 비밀번호 재설정 코드 확인:', {
        email: data.email,
        code: data.code,
      });

      if (!data.email || !data.code) {
        return HttpResponse.json(
          { message: '이메일과 코드가 필요합니다.' },
          { status: 400 },
        );
      }

      // 테스트용 코드: 123456
      if (data.code === '123456') {
        return HttpResponse.json({
          verified: true,
          token: 'reset_token_' + Date.now(), // 명세서 준수: reset_token → token
          message: '코드가 확인되었습니다.',
        });
      }

      return HttpResponse.json(
        { message: '잘못된 코드입니다.' },
        { status: 400 },
      );
    } catch (error) {
      console.error('❌ MSW - 코드 확인 오류:', error);
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  }),

  // 비밀번호 재설정 API (명세서: POST /api/v1/auth/password-reset/confirm)
  http.post('/api/v1/auth/password-reset/confirm', async ({ request }) => {
    try {
      const data = (await request.json()) as {
        token: string;
        newPassword: string;
      };
      console.log('🔒 MSW: 비밀번호 재설정:', {
        token: data.token ? '***' : undefined,
        newPassword: data.newPassword ? '***' : undefined,
      });

      // 필수 필드 검증 - 명세서 준수
      if (!data.token || !data.newPassword) {
        return HttpResponse.json(
          { message: '필수 정보가 누락되었습니다.' },
          { status: 400 },
        );
      }

      // 비밀번호 형식 검증
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      if (!passwordRegex.test(data.newPassword)) {
        return HttpResponse.json(
          {
            message:
              '비밀번호는 특수문자, 영문, 숫자를 포함하여 8자 이상이어야 합니다.',
          },
          { status: 400 },
        );
      }

      return HttpResponse.json({
        message: '비밀번호가 성공적으로 변경되었습니다.',
      });
    } catch (error) {
      console.error('❌ MSW - 비밀번호 재설정 오류:', error);
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  }),

  // 비밀번호 확인 API (명세서: POST /api/v1/auth/verify-password)
  http.post('/api/v1/auth/verify-password', async ({ request }) => {
    try {
      const data = (await request.json()) as { password: string };
      const authHeader = request.headers.get('Authorization');

      console.log('🔐 MSW: 비밀번호 확인:', { password: '***' });

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return HttpResponse.json(
          { message: '인증이 필요합니다.' },
          { status: 401 },
        );
      }

      // 비밀번호 검증 로직 (테스트용 비밀번호: 'password123!')
      if (data.password !== 'password123!') {
        console.log('❌ MSW: 비밀번호 검증 실패');
        return HttpResponse.json(
          { message: '비밀번호가 일치하지 않습니다.' },
          { status: 400 },
        );
      }

      console.log('✅ MSW: 비밀번호 검증 성공');
      return HttpResponse.json(
        { message: '비밀번호가 확인되었습니다.' },
        { status: 200 },
      );
    } catch (error) {
      console.error('❌ MSW - 비밀번호 확인 오류:', error);
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  }),

  // OAuth2 소셜 연동 해제 API (명세서: DELETE /api/v1/auth/unlink)
  http.delete('/api/v1/auth/unlink', ({ request }) => {
    try {
      const authHeader = request.headers.get('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return HttpResponse.json(
          { message: '인증이 필요합니다.' },
          { status: 401 },
        );
      }

      console.log('🔗 MSW: 소셜 연동 해제');

      return HttpResponse.json({
        message: '소셜 연동이 해제되었습니다.',
      });
    } catch (error) {
      console.error('❌ MSW - 소셜 연동 해제 오류:', error);
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  }),

  // 일반 비밀번호 확인 API (명세서: POST /api/v1/auth/verify-password)
  http.post('/api/v1/auth/verify-password', async ({ request }) => {
    try {
      const data = (await request.json()) as { password: string };
      const authHeader = request.headers.get('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return HttpResponse.json(
          { message: '인증이 필요합니다.' },
          { status: 401 },
        );
      }

      console.log('🔐 MSW: 일반 비밀번호 확인');

      // 테스트용: 비밀번호 확인 (mock user의 비밀번호와 비교)
      if (data.password === 'password123!') {
        return HttpResponse.json({
          verified: true,
          message: '비밀번호가 확인되었습니다.',
        });
      }

      return HttpResponse.json(
        {
          verified: false,
          message: '현재 비밀번호가 일치하지 않습니다.',
        },
        { status: 400 },
      );
    } catch (error) {
      console.error('❌ MSW - 일반 비밀번호 확인 오류:', error);
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  }),

  // 비밀번호 변경 API (명세서: PUT /api/v1/users/password)
  http.put('/api/v1/users/password', async ({ request }) => {
    try {
      const data = (await request.json()) as any;
      const authHeader = request.headers.get('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return HttpResponse.json(
          { message: '인증이 필요합니다.' },
          { status: 401 },
        );
      }

      console.log('🔐 MSW: 비밀번호 변경:', data);

      // 테스트용: 현재 비밀번호 확인
      if (data.currentPassword !== 'password123!') {
        return HttpResponse.json(
          { message: '현재 비밀번호가 일치하지 않습니다.' },
          { status: 400 },
        );
      }

      return HttpResponse.json({
        message: '비밀번호가 성공적으로 변경되었습니다.',
      });
    } catch (error) {
      console.error('❌ MSW - 비밀번호 변경 오류:', error);
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  }),
];
