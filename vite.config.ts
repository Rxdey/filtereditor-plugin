import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import monkey, { cdn } from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        icon: 'https://edit.filtereditor.cn/favicon.ico',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://edit.filtereditor.cn/'],
      },
      build: {
        externalGlobals: {
          vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
});
