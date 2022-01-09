import preact from '@preact/preset-vite'
import { UserConfig } from 'vite'

const config: UserConfig = {
  build: {
    rollupOptions: {
      output: {
        // need index.css to keep same filename (without hash) for "exports"
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  plugins: [
    preact(),
  ],
}

export default config
