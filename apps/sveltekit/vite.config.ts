import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [sveltekit(), viteCommonjs()],
})
