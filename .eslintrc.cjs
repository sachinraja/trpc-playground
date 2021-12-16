module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: [
    '@typescript-eslint',
  ],
  ignorePatterns: ['node_modules', 'dist'],
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
  parserOptions: {
    extraFileExtensions: ['.cjs'],
  },
  overrides: [
    {
      files: '*.ts',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
    },
    {
      files: '*.cjs',
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
}
