/* eslint-disable @typescript-eslint/no-var-requires */
const withPreact = require('next-plugin-preact')
const path = require('node:path')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const packagesDirPath = path.resolve(__dirname, '..')

const createAliases = (packageNames) =>
  packageNames.reduce((acc, packageName) => {
    acc[`@trpc-playground/${packageName}`] = path.resolve(packagesDirPath, packageName, 'src')
    return acc
  }, {})

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer(withPreact({
  reactStrictMode: true,
  experimental: {
    externalDir: true,
    esmExternals: false,
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
}))
