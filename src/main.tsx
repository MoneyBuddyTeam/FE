import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

// QueryClient 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      retry: failureCount => {
        // MSW 사용 시 재시도 횟수 조정
        const maxRetries = import.meta.env.VITE_USE_MSW === 'true' ? 1 : 3;
        return failureCount < maxRetries;
      },
    },
  },
});

// MSW 초기화 로직 개선
const enableMocking = async () => {
  if (
    import.meta.env.MODE === 'development' &&
    import.meta.env.VITE_USE_MSW === 'true'
  ) {
    try {
      const { worker } = await import('./mocks/browser');
      console.log('🚀 MSW 워커 초기화 중...');

      await worker.start({
        onUnhandledRequest: 'bypass',
      });

      console.log('✅ MSW 워커가 성공적으로 시작되었습니다.');

      // 디버그 모드일 때 핸들러 목록 출력
      if (import.meta.env.VITE_API_DEBUG === 'true') {
        console.log('🔧 MSW 디버그 모드 활성화');
      }
    } catch (error) {
      console.error('❌ MSW 워커 시작 실패:', error);
      // MSW 실패 시에도 앱은 계속 실행
    }
  } else {
    console.log('📡 실제 API 서버와 통신합니다.');
  }
};

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>,
  );
});
