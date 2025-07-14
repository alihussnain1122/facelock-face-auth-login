import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  optimizeDeps: {
    include: [
      '@tensorflow/tfjs',
      '@tensorflow/tfjs-core',
      '@tensorflow/tfjs-backend-cpu',
      '@tensorflow/tfjs-backend-webgl',
      'face-api.js'
    ],
    exclude: []
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'tensorflow': [
            '@tensorflow/tfjs',
            '@tensorflow/tfjs-core',
            '@tensorflow/tfjs-backend-cpu',
            '@tensorflow/tfjs-backend-webgl'
          ],
          'face-api': ['face-api.js']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@tensorflow/tfjs-core': '@tensorflow/tfjs-core/dist/tf-core.esm.js',
      '@tensorflow/tfjs-backend-cpu': '@tensorflow/tfjs-backend-cpu/dist/tf-backend-cpu.esm.js',
      '@tensorflow/tfjs-backend-webgl': '@tensorflow/tfjs-backend-webgl/dist/tf-backend-webgl.esm.js'
    }
  }
})
