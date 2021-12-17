import alias from 'esbuild-plugin-alias'
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
  // esbuildPlugins: [alias({
  //   'react': 'preact/compat',
  // })],
})

export default config
