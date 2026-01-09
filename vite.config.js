import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: [
          ['@emotion/babel-plugin'],
          // Temporarily disabled react-compiler as it may cause hook issues
          // ['babel-plugin-react-compiler'],
        ],
      },
    }),
  ],
  resolve: {
    dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@emotion/react', '@emotion/styled', '@mui/icons-material'],
    force: true,
  },
})
