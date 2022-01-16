import path from 'node:path'
import { defineConfig } from 'tsup'

const preactCompatPlugin = {
  name: 'preact-compat',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(build: any) {
    const preact = path.join(process.cwd(), 'node_modules', 'preact', 'compat', 'dist', 'compat.module.js')

    build.onResolve({ filter: /^(react-dom|react)$/ }, () => {
      return { path: preact }
    })
  },
}

const config = defineConfig({
  entry: ['src/index.ts'],
  inject: ['preact-inject.js'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  clean: true,
  esbuildPlugins: [preactCompatPlugin],
})

export default config
