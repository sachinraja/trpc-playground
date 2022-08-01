module.exports = {
  plugins: [
    require('tailwindcss')(),
    require('autoprefixer')(),
    require('postcss-prefix-selector')({
      exclude: ['body'],
      prefix: '.trpc-playground',
      transform(prefix, selector, prefixedSelector) {
        if (['html', '.trpc-playground'].includes(selector)) {
          return prefix
        } else {
          return prefixedSelector
        }
      },
    }),
  ],
}
