import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// Vite配置文件
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8081
  },
  preview: {
    host: '0.0.0.0',
    port: 8081
  },
  build: {
    // 代码分割策略
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue核心库
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // Vant UI组件库
          'vant-vendor': ['vant']
        },
        // 优化chunk文件名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 压缩选项
    minify: 'esbuild',
    // chunk大小警告阈值
    chunkSizeWarningLimit: 500,
    // 生成sourcemap便于调试
    sourcemap: false
  }
})
