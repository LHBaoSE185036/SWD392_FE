import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://157.230.40.203:8080',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/gym-face-id-access/api/v1')
            }
        }
    }
})