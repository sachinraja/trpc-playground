import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const packageJsonPath = path.resolve(__dirname, '..', 'package.json')

const distPath = path.join(__dirname, '..', 'dist')
const indexHtmlPath = path.join(distPath, 'index.html')

const indexHtml = await fs.readFile(indexHtmlPath, 'utf8')

let assetsHref

if (process.env.NODE_ENV === 'development') {
  assetsHref = 'http://localhost:45245/assets'
} else {
  const { version } = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
  assetsHref = `//cdn.jsdelivr.net/npm/@trpc-playground/html@${version}/dist/assets`
}

const cdnHtml = indexHtml.replace(/\/assets/g, assetsHref)

const variableName = 'cdnHtml'
const cdnHtmlDeclaration = `const ${variableName} = ${JSON.stringify(cdnHtml)}`

const esmJsHtmlPath = path.join(distPath, 'index.js')
const cjsJsHtmlPath = path.join(distPath, 'index.cjs')

await Promise.all([
  fs.writeFile(esmJsHtmlPath, `export ${cdnHtmlDeclaration}`),
  fs.writeFile(cjsJsHtmlPath, `${cdnHtmlDeclaration}\nmodule.exports = { ${variableName} }`),
])
