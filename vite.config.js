import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 環境変数でベースパスを動的に設定
  // Preview deployments use root path, production uses /koanest_LP/
  base: process.env.VITE_BASE_PATH || '/',
})
