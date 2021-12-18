const path = require('path')

module.exports = {
  overrides: [
    {
      files: '*.ts',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: path.join(__dirname, 'tsconfig.json'),
      },
    },
  ],
}
