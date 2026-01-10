import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from "node:url";
import { resolve, dirname  } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,           // Фиксированный порт
    strictPort: true,     // Ошибка, если порт занят (не переключится на другой)
    host: true,           // Для ngrok: доступен извне (--host)
    allowedHosts: [
      'jannette-grimy-shiela.ngrok-free.dev' // твой ngrok-домен
    ]    
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  }
})
