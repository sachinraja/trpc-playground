import { defineConfig } from 'tsup'
import { tsupDefaultConfig } from '../../scripts/tsup-config'

const config = defineConfig({
  ...tsupDefaultConfig,
  entry: ['src/index.ts', 'src/handlers/*'],
})

export default config
