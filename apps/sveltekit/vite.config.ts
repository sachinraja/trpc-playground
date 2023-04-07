import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, type Plugin } from 'vite'

export default defineConfig({
  plugins: [sveltekit(), viteCommonjs() as Plugin],
})
