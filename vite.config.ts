import { defineConfig } from 'vite';
import * as path from 'path';

export default defineConfig({
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        monacoTextMate: path.resolve(__dirname, 'static/monacoTextMate.html'),
        railroadDiagram: path.resolve(__dirname, 'static/railroadDiagram.html'),
      },
    },
  },
  optimizeDeps: {
    exclude: [
      'vscode-textmate', // TypeError: Cannot set properties of undefined (setting 'vscodetextmate')
      '@codingame/monaco-vscode-theme-defaults-default-extension', // new URL(..., import.meta.url)
    ],
  },
  resolve: {
    dedupe: ['vscode'],
  },
  server: {
    port: 5173,
  },
  worker: {
    format: 'es', // https://github.com/vitejs/vite/issues/18585
  },
});
