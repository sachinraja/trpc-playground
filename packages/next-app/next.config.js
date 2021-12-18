/* eslint-disable @typescript-eslint/no-var-requires */
const withPreact = require('next-plugin-preact')

/** @type {import('next').NextConfig} */
module.exports = withPreact({
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
})
