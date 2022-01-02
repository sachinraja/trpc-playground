import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const packageJsonPath = path.resolve(__dirname, '..', 'package.json')
const { version } = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))

const distPath = path.join(__dirname, '..', 'dist')
const indexHtmlPath = path.join(distPath, 'index.html')

const indexHtml = await fs.readFile(indexHtmlPath, 'utf8')
const cdnAssetsHref = `//cdn.jsdelivr.net/npm/@trpc-playground/html@${version}/dist/assets`
const cdnHtml = indexHtml.replace(/\/assets/g, cdnAssetsHref)

const variableName = 'cdnHtml'
const cdnHtmlDeclaration = `const ${variableName} = ${JSON.stringify(cdnHtml)}`

const esmJsHtmlPath = path.join(distPath, 'index.js')
const cjsJsHtmlPath = path.join(distPath, 'index.cjs')

await Promise.all([
  fs.writeFile(esmJsHtmlPath, `export ${cdnHtmlDeclaration}`),
  fs.writeFile(cjsJsHtmlPath, `${cdnHtmlDeclaration}\nmodule.exports = { ${variableName} }`),
])
