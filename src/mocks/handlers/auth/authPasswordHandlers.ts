import { http, HttpResponse } from 'msw';

export const authPasswordHandlers = [
  // 아이디 찾기 API (명세서: POST /api/v1/auth/find-id)
  http.post('/api/v1/auth/find-id', async ({ request }) => {
    try {
      const data = (await request.json()) as any;
      console.log('🔍 MSW: 아이디 찾기 요청:', data);

      // 이메일로 아이디 찾기 시뮬레이션
      if (data.email) {
        return HttpResponse.json({
          found_id: 'user***@example.com',
          message: '아이디를 찾았습니다.',
        });
      }

      return HttpResponse.json(
        { message: '해당 정보로 가입된 계정을 찾을 수 없습니다.' },
        { status: 404 },
      );
    } catch (error) {
      console.error('❌ MSW - 아이디 찾기 오류:', error);
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  }),

  // 비밀번호 재설정 요청 API (명세서: POST /api/v1/auth/request-reset-password)
  http.post('/api/v1/auth/request-reset-password', async ({ request }) => {
    try {
      const data = (await request.json()) as any;
      console.log('📧 MSW: 비밀번호 재설정 요청:', data);

      if (data.email) {
        return HttpResponse.json({
          message: '비밀번호 재설정 코드가 이메일로 발송되었습니다.',
          expires_in: 300, // 5분
        });
      }

      return HttpResponse.json(
        { message: '이메일이 필요합니다.' },
        { status: 400 },
      );
    } catch (error) {
      console.error('❌ MSW - 비밀번호 재설정 요청 오류:', error);
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  }),

  // 비밀번호 재설정 코드 확인 API (명세서: POST /api/v1/auth/verify-reset-code)
  http.post('/api/v1/auth/verify-reset-code', async ({ request }) => {
    try {
      const data = (await request.json()) as any;
      console.log('🔐 MSW: 비밀번호 재설정 코드 확인:', data);

      // 테스트용 코드: 123456
      if (data.code === '123456') {
        return HttpResponse.json({
          verified: true,
          reset_token: 'reset_token_' + Date.now(),
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

  // 비밀번호 재설정 API (명세서: POST /api/v1/auth/reset-password)
  http.post('/api/v1/auth/reset-password', async ({ request }) => {
    try {
      const data = (await request.json()) as any;
      console.log('🔒 MSW: 비밀번호 재설정:', data);

      if (data.reset_token && data.new_password) {
        return HttpResponse.json({
          message: '비밀번호가 성공적으로 변경되었습니다.',
        });
      }

      return HttpResponse.json(
        { message: '필수 정보가 누락되었습니다.' },
        { status: 400 },
      );
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

  // 비밀번호 변경 API
  http.patch('/api/v1/auth/change-password', async ({ request }) => {
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
