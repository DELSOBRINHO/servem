import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 443
    },
    // Adicionar explicitamente o host do Gitpod
    allowedHosts: [
      '5173-delsobrinho-servem-nnm5d23lvw3.ws-us118.gitpod.io',
      '.gitpod.io'
    ]
  },
})
