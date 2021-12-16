const { vanillaExtractPlugin } = require('@vanilla-extract/esbuild-plugin')

require('esbuild').build({
  entryPoints: ['src/components/playground.tsx'],
  bundle: true,
  plugins: [vanillaExtractPlugin()],
  outfile: 'out.js',
  external: ['@vanilla-extract/css'],
}).catch(() => process.exit(1))
