import { defineConfig } from 'tsup'

export const tsupDefaultConfig = defineConfig({
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
  },
  splitting: true,
  clean: true,
})

// for packages that are bundled in @trpc-playground/html
export const tsupBundledConfig = defineConfig({
  ...tsupDefaultConfig,
  target: 'node14',
})
