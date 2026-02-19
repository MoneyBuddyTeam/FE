import { http, HttpResponse } from 'msw';

export const socialLoginHandlers = [
  // 소셜 로그인 URL 조회
  http.get('/api/v1/auth/social/:provider/url', ({ params }) => {
    try {
      const { provider } = params;
      console.log(`🔗 MSW: ${provider} 소셜 로그인 URL 요청`);

      // 각 소셜 로그인 제공자별 가상 URL 반환
      const urls = {
        kakao: 'https://kauth.kakao.com/oauth/authorize?mock=true',
        google: 'https://accounts.google.com/o/oauth2/v2/auth?mock=true',
        naver: 'https://nid.naver.com/oauth2.0/authorize?mock=true',
      };

      return HttpResponse.json({ url: urls[provider as keyof typeof urls] });
    } catch (error) {
      console.error(`❌ MSW - 소셜 로그인 URL 조회 오류:`, error);
      return new HttpResponse(null, { status: 500 });
    }
  }),

  // 소셜 로그인 콜백 처리
  http.post(
    '/api/v1/auth/social/:provider/callback',
    async ({ params, request }) => {
      try {
        const { provider } = params;
        const data = await request.json();
        console.log(`🔐 MSW: ${provider} 소셜 로그인 콜백`, data);

        return HttpResponse.json({
          user: {
            id: 1,
            nickname: `${provider}User`,
            email: `user@${provider}.com`,
            role: 'USER',
          },
          tokens: {
            access_token: `mock_${provider}_access_token_${Date.now()}`,
            refresh_token: `mock_${provider}_refresh_token_${Date.now()}`,
          },
        });
      } catch (error) {
        console.error(`❌ MSW - 소셜 로그인 콜백 처리 오류:`, error);
        return new HttpResponse(null, { status: 500 });
      }
    },
  ),

  // 각 소셜 로그인 API - 구체적인 제공자만 매칭
  http.post('/api/v1/auth/kakao', async ({ request }) => {
    try {
      const data = await request.json();
      console.log(`🔐 MSW: kakao 소셜 로그인`, data);

      return HttpResponse.json({
        user: {
          id: 1,
          nickname: 'kakaoUser',
          email: 'user@kakao.com',
          role: 'USER',
        },
        tokens: {
          access_token: `mock_kakao_access_token_${Date.now()}`,
          refresh_token: `mock_kakao_refresh_token_${Date.now()}`,
        },
      });
    } catch (error) {
      console.error(`❌ MSW - kakao 로그인 오류:`, error);
      return new HttpResponse(null, { status: 500 });
    }
  }),

  http.post('/api/v1/auth/google', async ({ request }) => {
    try {
      const data = await request.json();
      console.log(`🔐 MSW: google 소셜 로그인`, data);

      return HttpResponse.json({
        user: {
          id: 1,
          nickname: 'googleUser',
          email: 'user@google.com',
          role: 'USER',
        },
        tokens: {
          access_token: `mock_google_access_token_${Date.now()}`,
          refresh_token: `mock_google_refresh_token_${Date.now()}`,
        },
      });
    } catch (error) {
      console.error(`❌ MSW - google 로그인 오류:`, error);
      return new HttpResponse(null, { status: 500 });
    }
  }),

  http.post('/api/v1/auth/naver', async ({ request }) => {
    try {
      const data = await request.json();
      console.log(`🔐 MSW: naver 소셜 로그인`, data);

      return HttpResponse.json({
        user: {
          id: 1,
          nickname: 'naverUser',
          email: 'user@naver.com',
          role: 'USER',
        },
        tokens: {
          access_token: `mock_naver_access_token_${Date.now()}`,
          refresh_token: `mock_naver_refresh_token_${Date.now()}`,
        },
      });
    } catch (error) {
      console.error(`❌ MSW - naver 로그인 오류:`, error);
      return new HttpResponse(null, { status: 500 });
    }
  }),
];
