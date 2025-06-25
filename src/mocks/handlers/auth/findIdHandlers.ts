import { http, HttpResponse } from 'msw';
import type { FindIdRequest, FindIdResponse } from '../../../types/auth';

const MOCK_USER_DATA = {
  name: '홍길동',
  phone: '010-1234-5678',
  email: 'hong@example.com',
  joinDate: '2024-01-01',
};

export const findIdHandlers = [
  http.post('/api/v1/auth/find-email', async ({ request }) => {
    try {
      const body = (await request.json()) as FindIdRequest;
      console.log('🔍 아이디 찾기 요청:', body);

      // 정확한 경로와 데이터 비교
      if (
        body.name === MOCK_USER_DATA.name &&
        body.phone === MOCK_USER_DATA.phone
      ) {
        console.log('✅ 사용자 정보 일치');
        const response: FindIdResponse = {
          email: MOCK_USER_DATA.email,
          joinDate: MOCK_USER_DATA.joinDate,
        };
        console.log('📨 응답 데이터:', response);
        return HttpResponse.json(response);
      }

      console.log('❌ 일치하는 사용자 없음');
      return HttpResponse.json(
        { message: '일치하는 회원이 없습니다.' },
        { status: 404 },
      );
    } catch (error) {
      console.error('❌ 아이디 찾기 처리 중 오류:', error);
      return HttpResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  }),
];
