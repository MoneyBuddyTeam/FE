import { http, HttpResponse } from 'msw';
import type { BookmarkToggleResponse } from '../../../types/bookmark';

export const bookmarkHandlers = [
  // 북마크 토글 - 명세서: POST /api/v1/bookmarks/toggle
  http.post('/api/v1/bookmarks/toggle', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 체크
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ 북마크: 인증되지 않은 사용자');
      return HttpResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 },
      );
    }

    const body = (await request.json()) as { expertId: number };
    const expertId = body.expertId;
    console.log('🔖 북마크 토글 핸들러 호출됨:', { expertId });

    // 명세서에 맞는 응답 구조
    const response: BookmarkToggleResponse = {
      bookmarked: true,
      message: '북마크가 토글되었습니다.',
      expertId,
    };

    return HttpResponse.json(response);
  }),

  // 북마크 목록 조회 - 명세서: GET /api/v1/bookmarks
  http.get('/api/v1/bookmarks', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 },
      );
    }

    // Expert 형태의 데이터로 직접 반환 (ExpertCard 컴포넌트와 호환)
    const expertsData = [
      {
        id: 1,
        nickname: '김전문',
        field: '투자',
        category: '투자',
        description: '투자 전문가입니다.',
        bio: '투자 전문가입니다.',
        profile_image: '/jpg/experts/expert1.png',
        rating: 4.8,
        review_count: 120,
        price: 50000,
        experience: 5,
        consultation_count: 50,
        bookmarks: 25,
        hashtags: ['투자', '자산관리'],
        is_online: true,
        isBookmarked: true,
      },
      {
        id: 2,
        nickname: '이상담',
        field: '소비',
        category: '소비',
        description: '소비 패턴 분석 전문가입니다.',
        bio: '소비 패턴 분석 전문가입니다.',
        profile_image: '/jpg/experts/expert2.png',
        rating: 4.9,
        review_count: 85,
        price: 45000,
        experience: 3,
        consultation_count: 30,
        bookmarks: 15,
        hashtags: ['소비', '절약'],
        is_online: true,
        isBookmarked: true,
      },
    ];

    return HttpResponse.json(expertsData);
  }),
];
