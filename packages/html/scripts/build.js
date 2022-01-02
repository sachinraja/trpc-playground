import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const distPath = path.join(__dirname, '..', 'dist')
const indexHtmlPath = path.join(distPath, 'index.html')
const indexHtmlContents = await fs.readFile(indexHtmlPath, 'utf8')
const jsDelivrIndexHtmlContents = indexHtmlContents.replace(
  '/assets',
  '//cdn.jsdelivr.net/npm/@trpc-playground/html/assets',
)

const jsHtmlPath = path.join(distPath, 'index.js')
const jsFileContents = `export const html = ${JSON.stringify(jsDelivrIndexHtmlContents)}`

await fs.writeFile(jsHtmlPath, jsFileContents)
