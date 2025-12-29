import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Prevent "Invalid hook call" from multiple React copies in dev.
    dedupe: ['react', 'react-dom'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true,
  },
  server: {
    port: 5173,
    host: true,
    // If WebSocket/HMR is problematic on this network/machine, disable it.
    // This avoids react-refresh / HMR websocket connection attempts entirely.
    hmr: false,
  },
  build: {
    // Performance optimizations
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for third-party libraries
          vendor: ['react', 'react-dom'],
          // UI components chunk
          ui: ['./src/components/ui/index.js'],
          // Assessment components chunk
          assessment: ['./src/components/assessment/index.js'],
          // Dashboard components chunk
          dashboard: ['./src/components/dashboard/index.js']
        }
      }
    },
    // Enable source maps for production debugging
    sourcemap: true,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // Performance optimizations for development
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-hook-form', 'zod']
  }
})