import { http, HttpResponse } from 'msw';

export const withdrawHandlers = [
  // 비밀번호 확인 API
  http.post('/api/v1/users/verify-password', async ({ request }) => {
    try {
      const { password } = (await request.json()) as { password: string };
      const authHeader = request.headers.get('Authorization');

      console.log('🔐 MSW 회원탈퇴 비밀번호 확인 요청:', { password: '***' });
      console.log('🔐 Authorization 헤더:', authHeader);

      // 인증 토큰 검사
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('❌ MSW: 인증되지 않은 사용자');
        return HttpResponse.json(
          { message: '인증이 필요합니다.' },
          { status: 401 },
        );
      }

      // 현재 로그인된 사용자의 비밀번호와 비교
      const MOCK_USER = {
        email: 'user@example.com',
        password: 'password123!',
      };

      console.log('🔐 MSW: verify-password-withdraw 비밀번호 확인 중', {
        입력된_비밀번호: '***',
        실제_비밀번호: '***',
      });

      if (password === MOCK_USER.password) {
        console.log('✅ MSW: verify-password-withdraw 성공');
        return HttpResponse.json(
          {
            success: true,
            message: '비밀번호가 확인되었습니다.',
            isValid: true,
            verified: true,
          },
          { status: 200 },
        );
      }

      console.log('❌ MSW: verify-password-withdraw 실패 - 비밀번호 불일치');
      return HttpResponse.json(
        {
          success: false,
          message: '현재 비밀번호가 일치하지 않습니다.',
          isValid: false,
          verified: false,
        },
        { status: 400 },
      );
    } catch (error) {
      console.error('🚨 MSW 비밀번호 확인 핸들러 에러:', error);
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  }), // 회원탈퇴 API - 명세서 준수 (DELETE /api/v1/users/{id})
  http.delete('/api/v1/users/:id', async ({ params }) => {
    try {
      const userId = params.id;
      console.log('🚪 MSW 회원탈퇴 요청:', { userId });

      // 명세서에 따라 204 No Content 반환
      console.log('✅ MSW 회원탈퇴 성공');
      return new HttpResponse(null, { status: 204 });
    } catch (error) {
      console.error('🚨 MSW 회원탈퇴 핸들러 에러:', error);
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  }),
];
