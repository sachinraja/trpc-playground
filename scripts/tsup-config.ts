import { defineConfig } from 'tsup'

export const tsupDefaultConfig = defineConfig({
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
  },
  clean: true,
})

// for packages that are bundled in @trpc-playground/html
export const tsupBundledConfig = defineConfig({
  ...tsupDefaultConfig,
  format: ['esm'],
  target: 'node14',
})
