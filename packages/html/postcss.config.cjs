module.exports = {
  plugins: [
    require("tailwindcss")(),
    require("autoprefixer")(),
    require("postcss-prefix-selector")({
      prefix: ".trpc-playground",
      transform(prefix, selector, prefixedSelector) {
        if (selector === "body") return selector;

        if (["html", ".trpc-playground"].includes(selector)) {
          return prefix;
        } else {
          return prefixedSelector;
        }
      },
    }),
  ],
};
