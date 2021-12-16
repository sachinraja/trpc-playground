const coreConfig = require('../core/tailwind.config.cjs')
module.exports = {
  ...coreConfig,
  content: ['../core/src/components/**/*.tsx'],
}
