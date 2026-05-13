import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Le decimos a Vite que '@' significa 'la carpeta src'
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})