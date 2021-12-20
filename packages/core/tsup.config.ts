import path from 'node:path'
import { defineConfig } from 'tsup'
// tsup does not expose esbuild
import { Plugin } from '../../node_modules/.pnpm/esbuild@0.14.5/node_modules/esbuild'

const preactCompatPlugin: Plugin = {
  name: 'preact-compat',
  setup(build) {
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
  dts: {
    resolve: true,
  },
  splitting: true,
  clean: true,
  esbuildPlugins: [preactCompatPlugin],
})

export default config
