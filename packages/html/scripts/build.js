import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const distPath = path.join(__dirname, '..', 'dist')
const indexHtmlPath = path.join(distPath, 'index.html')
const indexHtmlContents = await fs.readFile(indexHtmlPath, 'utf8')
const jsDelivrIndexHtmlContents = indexHtmlContents.replace(
  /\/assets/g,
  '//cdn.jsdelivr.net/npm/@trpc-playground/html/assets',
)

const esmJsHtmlPath = path.join(distPath, 'index.js')
const cjsJsHtmlPath = path.join(distPath, 'index.cjs')

const variableName = 'cdnHtml'
const cdnHtmlDeclaration = `const ${variableName} = ${JSON.stringify(jsDelivrIndexHtmlContents)}`

await Promise.all([
  fs.writeFile(esmJsHtmlPath, `export ${cdnHtmlDeclaration}`),
  fs.writeFile(cjsJsHtmlPath, `${cdnHtmlDeclaration}\nmodule.exports = { ${variableName} }`),
])
