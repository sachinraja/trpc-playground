import path from 'node:path'
import { defineConfig } from 'vite'
import baseConfig from '../../packages/html/vite.config'

const packagesDirPath = path.resolve(__dirname, '..', '..', 'packages')

const createAliases = (packageNames: string[]) =>
  packageNames.reduce((acc, packageName) => {
    acc[`@trpc-playground/${packageName}`] = path.resolve(packagesDirPath, packageName, 'src')
    return acc
  }, {} as Record<string, string>)

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: baseConfig.plugins,
  resolve: {
    alias: {
      ...createAliases([
        'components',
        'query-extension',
        'typescript-extension',
      ]),
      'trpc-playground': path.resolve(packagesDirPath, 'trpc-playground', 'src'),
      // should point to the source css file so that it changes when the component files change
      '@trpc-playground/html/css': path.resolve(packagesDirPath, 'html', 'src', 'global.css'),
    },
  },
})
