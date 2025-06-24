import { http, HttpResponse } from 'msw';
import type {
  RequestResetPasswordRequest,
  VerifyResetCodeRequest,
  ResetPasswordRequest,
} from '../../../types/auth';

const MOCK_USER = {
  email: 'test@example.com',
  verificationCode: '123456',
};

export const resetPasswordHandlers = [
  // 비밀번호 재설정 요청
  http.post('/api/v1/auth/password-reset/request', async ({ request }) => {
    const body = (await request.json()) as RequestResetPasswordRequest;
    console.log('Reset password request:', body); // 디버깅용

    if (body.email === 'test@example.com') {
      return HttpResponse.json(
        { message: '인증 메일을 전송했습니다.' },
        { status: 200 },
      );
    }

    return new HttpResponse(
      JSON.stringify({ message: '가입된 이메일이 아닙니다.' }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }),
  // 인증 코드 확인
  http.post('/api/v1/auth/password-reset/verify', async ({ request }) => {
    const body = (await request.json()) as VerifyResetCodeRequest;

    if (
      body.email === MOCK_USER.email &&
      body.code === MOCK_USER.verificationCode
    ) {
      return HttpResponse.json({ token: 'valid-reset-token' }, { status: 200 });
    }

    return new HttpResponse(
      JSON.stringify({ message: '유효하지 않은 인증번호입니다.' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }),
  // 새 비밀번호 설정
  http.post('/api/v1/auth/password-reset/confirm', async ({ request }) => {
    const body = (await request.json()) as ResetPasswordRequest;

    if (body.token === 'valid-reset-token') {
      return HttpResponse.json(
        { message: '비밀번호가 성공적으로 변경되었습니다.' },
        { status: 200 },
      );
    }

    return new HttpResponse(
      JSON.stringify({ message: '유효하지 않은 토큰입니다.' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }),
];
