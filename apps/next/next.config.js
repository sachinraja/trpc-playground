/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('node:path')

const packagesDirPath = path.resolve(__dirname, '..', '..', 'packages')

const createAliases = (packageNames) =>
  packageNames.reduce((acc, packageName) => {
    acc[`@trpc-playground/${packageName}`] = path.resolve(packagesDirPath, packageName, 'src')
    return acc
  }, {})

/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    externalDir: true,
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...createAliases([
        'components',
        'query-extension',
        'typescript-extension',
      ]),
      'trpc-playground': path.resolve(packagesDirPath, 'trpc-playground', 'src'),
      // should point to the source css file so that it changes when the component files change
      '@trpc-playground/html/css$': path.resolve(packagesDirPath, 'html', 'src', 'global.css'),
    }

    return config
  },
}
