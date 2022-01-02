import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // need index.css to keep same filename (without hash) for "exports"
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  plugins: [preact()],
})
