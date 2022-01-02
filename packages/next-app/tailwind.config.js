/* eslint-disable @typescript-eslint/no-var-requires */
const coreConfig = require('../components/tailwind.config.cjs')
module.exports = {
  ...coreConfig,
  content: ['../components/src/components/**/*.tsx'],
}
