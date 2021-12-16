import { defineConfig } from 'tsup'

const config = defineConfig({
  entry: ['src/components/playground.tsx'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
  },
  splitting: true,
  clean: true,
})

export default config
