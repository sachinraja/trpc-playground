import { defineConfig } from 'tsup'
import { tsupDefaultConfig } from '../../scripts/tsup-config'
import htmlPkg from '../html/package.json'

const config = defineConfig({
  ...tsupDefaultConfig,
  entry: ['src/index.ts', 'src/handlers/*'],
  esbuildPlugins: [{
    name: 'replace-version',
    setup(build) {
      build.onResolve({ filter: /^\.\/html-version$/ }, (args) => {
        return {
          path: args.path,
          namespace: 'html-version',
        }
      })
      build.onLoad({ filter: /.*/, namespace: 'html-version' }, () => {
        console.log('replacing version')
        return {
          contents: JSON.stringify(htmlPkg),
          loader: 'json',
        }
      })
    },
  }],
  dts: false,
})

export default config
