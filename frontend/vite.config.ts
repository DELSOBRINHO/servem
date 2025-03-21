import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente do arquivo .env
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
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
    // Garantir que as variáveis de ambiente estejam disponíveis
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY)
    }
  }
})
