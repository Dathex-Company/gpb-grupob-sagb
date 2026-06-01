import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Carrega somente variáveis VITE_ do .env conforme o modo
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const envPortRaw = process.env.PORT || env.VITE_DEV_SERVER_PORT
  const resolvedPort = Number(envPortRaw || 7000)

  // Base padrão para deploy no domínio raiz
  // Se você quiser subpasta, defina VITE_BASE_PATH="/sua-subpasta/"
  const basePath = env.VITE_BASE_PATH && env.VITE_BASE_PATH.trim() ? env.VITE_BASE_PATH : '/'
  const aiProxyTarget = env.VITE_AI_PROXY_TARGET && env.VITE_AI_PROXY_TARGET.trim()
    ? env.VITE_AI_PROXY_TARGET
    : 'https://sagb.piblo.com.br'

  return {
    base: basePath,
    plugins: [react()],
    server: {
      port: Number.isFinite(resolvedPort) ? resolvedPort : 7000,
      strictPort: true,
      host: true,
      watch: {
        // Mais estável em ambiente de rede/WSL/UNC
        usePolling: true,
        interval: 1000
      },
      proxy: {
        '/api': {
          target: aiProxyTarget,
          changeOrigin: true,
          secure: true
        },
        // Proxy para webhooks financeiros (desenvolvimento)
        '/api/finance/webhook': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path // Mantém o mesmo path
        },
        // Proxy para testes de webhook
        '/api/finance/test-signature': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      // Evita falha de build quando `dist/assets` está bloqueado pelo filesystem/Windows.
      // Não altera lógica de aplicação; apenas direciona os assets gerados para pasta limpa.
      assetsDir: 'assets_build',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined
            if (id.includes('react-markdown')) return 'markdown'
            if (id.includes('@google/genai')) return 'ai-sdk'
            if (id.includes('react') || id.includes('scheduler')) return 'react-vendor'
            return 'vendor'
          }
        }
      }
    },

    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    }
  }
})
