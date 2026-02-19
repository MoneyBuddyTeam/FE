import { http, HttpResponse } from 'msw';

export const passwordChangeHandlers = [
  http.put('/api/v1/users/password', async ({ request }) => {
    const { currentPassword } = (await request.json()) as {
      currentPassword: string;
      newPassword: string;
    };

    console.log('🔐 MSW 비밀번호 변경 요청:', {
      currentPassword: '***',
      newPassword: '***',
    });

    // 기존 비밀번호 검증 - 하드코딩된 올바른 비밀번호
    const MOCK_CURRENT_PASSWORD = 'password123!';

    // 기존 비밀번호가 틀린 경우 400 에러 반환
    if (currentPassword !== MOCK_CURRENT_PASSWORD) {
      console.log('❌ MSW 비밀번호 변경 실패 - 잘못된 기존 비밀번호');
      return HttpResponse.json(
        { message: '틀린 비밀번호 입니다. 다시 입력해주세요.' },
        { status: 400 },
      );
    }

    // 비밀번호 변경 성공
    console.log('✅ MSW 비밀번호 변경 성공');
    return HttpResponse.json(
      { message: '비밀번호가 성공적으로 변경되었습니다.' },
      { status: 200 },
    );
  }),
];
