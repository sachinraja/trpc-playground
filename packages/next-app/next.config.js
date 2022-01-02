/* eslint-disable @typescript-eslint/no-var-requires */
const withPreact = require('next-plugin-preact')
const path = require('node:path')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer(withPreact({
  reactStrictMode: true,
  experimental: {
    externalDir: true,
    esmExternals: false,
  },
  webpack(config) {
    config.resolve.alias['@trpc-playground/html'] = path.resolve(
      __dirname,
      '..',
      'html',
      'dist',
    )
    return config
  },
}))
