import { http, HttpResponse } from 'msw';
import type { LoginRequest } from '../../../types/auth';

export const loginHandlers = [
  http.post('/api/v1/users/login', async ({ request }) => {
    try {
      const { email, password } = (await request.json()) as LoginRequest;

      console.log('🔐 MSW 로그인 요청:', { email, password: '***' });

      if (email === 'test@example.com' && password === 'password123!') {
        const userId = 1;
        const accessToken = 'mock_access_token_1_' + Date.now();
        const refreshToken = 'mock_refresh_token_1_' + Date.now();

        console.log('✅ MSW 로그인 성공');

        // 명세서에 따른 Map 형식 응답 + httpOnly 쿠키
        return new Response(
          JSON.stringify({
            token: accessToken,
            email: 'test@example.com',
            nickname: '사용자닉네임',
            userId: userId, // 사용자 ID 추가
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Set-Cookie': [
                `token=${accessToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`,
                `refresh_token=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`,
              ].join(', '),
            },
          },
        );
      }

      console.log('❌ MSW 로그인 실패 - 잘못된 자격증명');
      return HttpResponse.json(
        { message: '이메일 또는 비밀번호가 올바르지 않습니다' },
        { status: 401 },
      );
    } catch (error) {
      console.error('❌ MSW 로그인 핸들러 오류:', error);
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  }),

  // 로그아웃 API - 명세서 준수
  http.post('/api/v1/auth/logout', async () => {
    console.log('🚪 MSW 로그아웃 요청');

    // 쿠키에서 토큰 제거 시뮬레이션
    return new Response(null, {
      status: 200,
      headers: {
        'Set-Cookie': [
          'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict',
          'refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict',
        ].join(', '),
      },
    });
  }),
];
