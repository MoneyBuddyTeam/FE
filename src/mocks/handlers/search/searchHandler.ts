import { http, HttpResponse } from 'msw';

export const searchHandlers = [
  http.get('/api/v1/search/suggestions', ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword') || '';

    const dummy = [
      '투자 입문',
      '투자 전략 파헤치기',
      '투자 기초 용어',
      '투자 하나부터 열까지',
      '투자와 저축에 관하여',
    ];
    const filtered = dummy.filter(item =>
      item.toLowerCase().startsWith(keyword.toLowerCase()),
    );

    return HttpResponse.json(filtered);
  }),

  http.get('/api/v1/search', ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword') || '';

    if (!keyword.trim()) {
      return HttpResponse.json({
        experts: [],
        lectures: [],
        megazines: [],
        community: [],
      });
    }

    const experts = [
      {
        id: 1,
        name: '이경순',
        tags: ['재무상담', '소비계획'],
        description: '금융을 알기 쉽게 알려주는 금융 전문가',
        profileImage: '/experts/1.png',
        imgUrl: '/experts/1.png',
        rating: 4.8,
        reviewCount: 32,
        isLiked: false,
        rank: 1,
      },
      {
        id: 2,
        name: '이지선',
        tags: ['투자', '저축계획'],
        description: '친절하게 미국 투자를 알려드려요',
        profileImage: '/experts/2.png',
        imgUrl: '/experts/2.png',
        rating: 4.5,
        reviewCount: 20,
        isLiked: true,
        rank: 2,
      },
    ];

    const lectures = [
      {
        id: 101,
        title: '배당주 투자로 꾸준한 수익 만들기',
        level: '입문',
        description:
          '배당 수익 기초, 배당주 선택 전략, 그리고 장기 운영법을 소개합니다.',
        thumbnail: '/lectures/101.png',
      },
      {
        id: 102,
        title: '투자 전략 파헤치기',
        level: '중급',
        description: 'FIRE 운동의 원리와 실행 방법을 설명합니다.',
        thumbnail: '/lectures/102.png',
      },
    ];

    const megazines = [
      {
        id: 201,
        title: '재무계획의 기초',
        description: '당신의 삶에 꼭 맞는 재무 계획 세우는 법',
        author: '홍길동',
        date: '2024.06.01',
        thumbnail: '/megazines/201.png',
      },
    ];

    const community = [
      {
        id: 301,
        title: '재테크 고민 공유해요',
        views: 120,
        comments: 5,
        badge: 'Q&A',
      },
      {
        id: 302,
        title: '소비 줄이기 실천 후기',
        views: 88,
        comments: 3,
      },
    ];

    return HttpResponse.json({
      experts,
      lectures,
      megazines,
      community,
    });
  }),
];
