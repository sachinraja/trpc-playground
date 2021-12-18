import alias from '@rollup/plugin-alias'
import html from '@rollup/plugin-html'
import inject from '@rollup/plugin-inject'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import postcss from 'rollup-plugin-postcss'

export default {
  input: 'src/index.tsx',
  output: {
    dir: 'dist',
    format: 'iife',
  },
  plugins: [
    postcss({ extract: true }),
    nodeResolve(),
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom', replacement: 'preact/compat' },
        { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
        { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
      ],
    }),
    esbuild({ target: 'es6' }),
    inject({
      'h': ['preact', 'h'],
    }),
    html(),
  ],
}
