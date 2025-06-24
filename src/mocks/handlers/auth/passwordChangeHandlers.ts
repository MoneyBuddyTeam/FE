import { http } from 'msw';
import { validateToken, createResponse } from './constants';

// 비밀번호 변경 요청 타입
interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const passwordChangeHandlers = [
  // 현재 비밀번호 검증 API
  http.post('/api/v1/auth/verify-password', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    console.log('🔍 MSW: 비밀번호 검증 요청 - Auth:', authHeader);

    // 토큰 검증
    if (!validateToken(authHeader)) {
      console.log('❌ MSW: 비밀번호 확인 - 인증되지 않은 사용자');
      return createResponse('UNAUTHORIZED', '인증이 필요합니다.', null, 401);
    }

    const { password } = (await request.json()) as { password: string };

    // 실제 사용자의 비밀번호와 비교 (하드코딩된 값과 비교)
    if (password === 'password123!') {
      console.log('✅ MSW: 비밀번호 검증 성공');
      return createResponse('SUCCESS', '비밀번호가 확인되었습니다.', {
        isValid: true,
      });
    }

    console.log('❌ MSW: 비밀번호 검증 실패');
    return createResponse(
      'INVALID_PASSWORD',
      '현재 비밀번호가 일치하지 않습니다.',
      null,
      400,
    );
  }),

  // 비밀번호 변경 API
  http.put('/api/v1/users/password', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!validateToken(authHeader)) {
      console.log('❌ MSW: 비밀번호 변경 - 인증되지 않은 사용자');
      return createResponse('UNAUTHORIZED', '인증이 필요합니다.', null, 401);
    }

    console.log('🔐 MSW: 비밀번호 변경 요청 처리 중...');

    try {
      const { currentPassword, newPassword } =
        (await request.json()) as ChangePasswordRequest;
      console.log('🔐 MSW: 비밀번호 변경 요청');

      // 현재 비밀번호 검증
      if (currentPassword !== 'password123!') {
        return createResponse(
          'INVALID_PASSWORD',
          '현재 비밀번호가 일치하지 않습니다.',
          null,
          400,
        );
      }

      // 새 비밀번호 유효성 검사 (최소 10자, 영문/숫자/특수문자 포함)
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{10,}$/;
      if (!passwordRegex.test(newPassword)) {
        return createResponse(
          'INVALID_PASSWORD_FORMAT',
          '새 비밀번호는 10자 이상이며, 영문, 숫자, 특수문자를 포함해야 합니다.',
          null,
          400,
        );
      }

      // 이전 비밀번호와 동일한 경우
      if (newPassword === currentPassword) {
        return createResponse(
          'SAME_AS_CURRENT_PASSWORD',
          '새 비밀번호가 현재 비밀번호와 동일합니다.',
          null,
          400,
        );
      }

      console.log('✅ MSW: 비밀번호 변경 성공');
      return createResponse(
        'SUCCESS',
        '비밀번호가 성공적으로 변경되었습니다.',
        null,
      );
    } catch (error) {
      console.error('❌ MSW: 비밀번호 변경 요청 처리 중 오류:', error);
      return createResponse('INVALID_REQUEST', '잘못된 요청입니다.', null, 400);
    }
  }),
];
