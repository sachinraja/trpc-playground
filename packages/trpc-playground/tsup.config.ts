import { defineConfig } from 'tsup'

const config = defineConfig({
  entry: ['src/index.ts', 'src/handlers/next.ts'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
  },
  splitting: true,
  clean: true,
})

export default config
