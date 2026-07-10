/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        additionalData: `@use "@/styles/_variables.scss" as *;`,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    environment: 'node',
  },
})
