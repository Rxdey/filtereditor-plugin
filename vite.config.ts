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
        name: '一乐编辑器命运卡高级编辑扩展',
        description: '命运卡/暗金高级编辑预览',
        author: 'rxdey',
        license: 'MIT',
        icon: 'https://edit.filtereditor.cn/favicon.ico',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://edit.filtereditor.cn/*', 'https://price.filtereditor.cn/*'],
        "run-at": 'document-start'
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
