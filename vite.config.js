import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import compression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Gzip 压缩
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // 10KB 以上才压缩
    }),
  ],
  base: '/wallpaper-gallery/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/variables" as *;`,
      },
    },
  },
  // 生产环境移除 console
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    // 分块策略
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue'],
        },
        // 优化文件名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // 块大小警告阈值
    chunkSizeWarningLimit: 500,
  },
})
