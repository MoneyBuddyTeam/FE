import { http, HttpResponse } from 'msw';

export const bookmarkHandlers = [
  // 북마크 토글
  http.post(
    '/api/v1/bookmarks/toggle/:expertId',
    async ({ params, request }) => {
      const authHeader = request.headers.get('Authorization');

      // 인증 체크
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('❌ 북마크: 인증되지 않은 사용자');
        return HttpResponse.json(
          { message: '로그인이 필요합니다.' },
          { status: 401 },
        );
      }

      const expertId = Number(params.expertId);
      console.log('🔖 북마크 토글 핸들러 호출됨:', { expertId });

      return HttpResponse.json({
        bookmarked: true,
        message: '북마크가 토글되었습니다.',
        expertId,
      });
    },
  ),

  // 북마크 목록 조회
  http.get('/api/v1/bookmarks', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 },
      );
    }

    return HttpResponse.json([
      {
        expertId: 1,
        expertName: '김전문',
        field: '투자',
        description: '투자 전문가입니다.',
      },
      {
        expertId: 2,
        expertName: '이상담',
        field: '소비',
        description: '소비 패턴 분석 전문가입니다.',
      },
    ]);
  }),
];
