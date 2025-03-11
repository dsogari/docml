import { defineConfig } from 'vite';
import * as path from 'path';

export default defineConfig(() => {
  const config = {
    build: {
      target: 'esnext',
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, 'index.html'),
          monacoMonarch: path.resolve(__dirname, 'static/monacoMonarch.html'),
          monacoTextMate: path.resolve(__dirname, 'static/monacoTextMate.html'),
          railroadDiagram: path.resolve(__dirname, 'static/railroadDiagram.html'),
        },
      },
    },
    resolve: {
      dedupe: ['vscode'],
    },
    server: {
      port: 5173,
    },
  };
  return config;
});
