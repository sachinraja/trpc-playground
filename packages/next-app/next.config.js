/* eslint-disable @typescript-eslint/no-var-requires */
const withPreact = require('next-plugin-preact')

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
}))
