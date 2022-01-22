import { transform, TransformOptions } from 'esbuild'
import { parse } from 'node-html-parser'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const distPath = path.join(__dirname, '..', 'dist')
const indexHtmlPath = path.join(distPath, 'index.html')

const templatePath = path.join(__dirname, 'template.ts')

const indexHtml = await fs.readFile(indexHtmlPath, 'utf8')
const parsedHtml = parse(indexHtml)

const scripts = parsedHtml.querySelectorAll('script')
const stringScripts = scripts.map((script) => {
  script.remove()
  const src = script.getAttribute('src')
  if (src) {
    // remove leading slash
    script.setAttribute('src', `\${buildCdnUrl('@trpc-playground/html', 'dist/${src.slice(1)}')}`)
  }

  return script.toString()
})

const links = parsedHtml.querySelectorAll('link')
const stringLinks = links.map((link) => {
  link.remove()
  const href = link.getAttribute('href')
  if (href) {
    link.setAttribute('href', `\${buildCdnUrl('@trpc-playground/html', 'dist/${href.slice(1)}')}`)
  }

  return link.toString()
})

const template = await fs.readFile(templatePath, 'utf8')

const cdnHtmlDeclaration = template
  .replace('{scripts}', stringScripts.join('\n'))
  .replace('{links}', stringLinks.join('\n'))

const transformCdnHtmlTs = async (options: TransformOptions) => {
  const { code } = await transform(cdnHtmlDeclaration, {
    target: 'node12',
    loader: 'ts',
    ...options,
  })
  return code
}

const esmJsHtmlPath = path.join(distPath, 'index.js')
const cjsJsHtmlPath = path.join(distPath, 'index.cjs')

await Promise.all([
  (async () => {
    const code = await transformCdnHtmlTs({
      format: 'esm',
    })
    await fs.writeFile(esmJsHtmlPath, code)
  })(),
  (async () => {
    const code = await transformCdnHtmlTs({
      format: 'cjs',
    })
    await fs.writeFile(cjsJsHtmlPath, code)
  })(),
])
