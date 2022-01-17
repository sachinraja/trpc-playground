/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('node:path')

const packagesDirPath = path.resolve(__dirname, '..', '..', 'packages')

/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    externalDir: true,
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@trpc-playground/html': path.resolve(packagesDirPath, 'html', 'dist', 'index.js'),
      'trpc-playground': path.resolve(packagesDirPath, 'trpc-playground', 'src'),
    }

    return config
  },
}
