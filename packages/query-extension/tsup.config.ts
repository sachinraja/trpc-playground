import { defineConfig } from 'tsup'
import { tsupBundledConfig } from '../../scripts/tsup-config'

const config = defineConfig({
  ...tsupBundledConfig,
  entry: ['src/index.ts'],
})

export default config
