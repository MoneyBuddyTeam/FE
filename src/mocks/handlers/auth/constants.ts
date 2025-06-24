// 모든 인증 관련 핸들러에서 사용할 상수들

export const MOCK_USER = {
  id: 1,
  email: 'user@example.com',
  password: 'password123!', // 모든 핸들러에서 사용할 고정된 테스트 비밀번호
  nickname: '테스트사용자',
  role: 'USER',
  loginMethod: 'EMAIL',
  profileImage: '/jpg/experts/expert1.png',
};

// 공통 응답 생성 함수
export const createResponse = (
  code: string,
  message: string,
  data?: any,
  status = 200,
) => {
  const response = {
    code,
    message,
    ...(data ? { data } : {}),
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 공통 토큰 검증 함수
export const validateToken = (authHeader: string | null): boolean => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  return authHeader.includes('mock_login_access_token_');
};
