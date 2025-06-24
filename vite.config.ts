import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [],
        parserOpts: {
          plugins: ['decorators-legacy'],
        },
      },
    }),
  ],
  define: {
    global: {},
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://apis.data.go.kr',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
        secure: false,
        ws: true,
      },
    },
  },
  publicDir: 'public', // public 디렉토리 설정
});
