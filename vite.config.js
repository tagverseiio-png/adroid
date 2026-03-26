import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Change this if deploying to subdirectory, e.g., '/your-app-name/'
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    // Code splitting: separate vendor chunks
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
          'vendor-scroll': ['lenis'],
        },
      },
    },
    // Smaller chunk warning threshold
    chunkSizeWarningLimit: 600,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Target modern browsers for smaller output
    target: 'es2020',
    // Minification
    minify: 'esbuild',
  },
})
