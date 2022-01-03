module.exports = {
  plugins: [
    'tailwindcss',
    'autoprefixer',
    ['postcss-prefix-selector', {
      prefix: '.trpc-playground',
      transform(prefix, selector, prefixedSelector) {
        if (['body', 'html', '.trpc-playground'].includes(selector)) {
          return prefix
        } else {
          return prefixedSelector
        }
      },
    }],
  ],
}
