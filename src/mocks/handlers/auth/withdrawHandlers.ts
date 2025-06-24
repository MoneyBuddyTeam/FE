import { http } from 'msw';
import { MOCK_USER, validateToken, createResponse } from './constants';

export const withdrawHandlers = [
  // 비밀번호 확인 API
  http.post('/api/v1/auth/verify-password-withdraw', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 토큰 검사
    if (!validateToken(authHeader)) {
      console.log('❌ MSW: 인증되지 않은 사용자');
      return createResponse('UNAUTHORIZED', '인증이 필요합니다.', null, 401);
    }

    try {
      const { password } = (await request.json()) as { password: string };
      console.log('🔐 MSW: verify-password-withdraw 비밀번호 확인 중', {
        입력된_비밀번호: '***',
        실제_비밀번호: '***',
      });

      if (password === MOCK_USER.password) {
        console.log('✅ MSW: verify-password-withdraw 성공');
        return createResponse('SUCCESS', '비밀번호가 확인되었습니다.', {
          isValid: true,
          verified: true,
        });
      }

      console.log('❌ MSW: verify-password-withdraw 실패 - 비밀번호 불일치');
      return createResponse(
        'INVALID_PASSWORD',
        '현재 비밀번호가 일치하지 않습니다.',
        {
          isValid: false,
          verified: false,
        },
        400,
      );
    } catch (error) {
      console.error('🚨 MSW 비밀번호 확인 핸들러 에러:', error);
      return createResponse(
        'SERVER_ERROR',
        '서버 오류가 발생했습니다.',
        null,
        500,
      );
    }
  }),

  // 회원탈퇴 API
  http.delete('/api/v1/users/:id', async ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 토큰 검사
    if (!validateToken(authHeader)) {
      console.log('❌ MSW: 인증되지 않은 사용자');
      return createResponse('UNAUTHORIZED', '인증이 필요합니다.', null, 401);
    }

    try {
      const userId = params.id;
      console.log('🚪 MSW 회원탈퇴 요청:', { userId });

      // 명세서에 따라 204 No Content 반환
      console.log('✅ MSW 회원탈퇴 성공');
      return new Response(null, { status: 204 });
    } catch (error) {
      console.error('🚨 MSW 회원탈퇴 핸들러 에러:', error);
      return createResponse(
        'SERVER_ERROR',
        '서버 오류가 발생했습니다.',
        null,
        500,
      );
    }
  }),
];
