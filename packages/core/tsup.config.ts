import { defineConfig } from 'tsup'

const config = defineConfig({
  entry: ['src/index.ts'],
  inject: ['preact-inject.js'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
  },
  splitting: true,
  clean: true,
})

export default config
