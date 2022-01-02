import glob from 'fast-glob'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// The goal of this build step is to generate two artifacts (per dependency):
// 1. Metadata: version + file list of dependency (meta.js)
// 2. Data: A key-value store from file names to file content (data.js)
//
// Both of these will be dynamically required by the TS editor.

// Dependencies that artifacts need to be generated for
const dependencies = {
  // Core TS libs
  typescript: {
    version: '4.3.5',
    src: ['lib/*.d.ts'],
  },
  // Node lubs
  '@types/node': {
    version: '14', // Because this is the version of Node on Vercel
    src: ['*.d.ts'],
  },
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DEST_ROOT = path.resolve(__dirname, '..', 'src', 'types')

const DISCLAIMER = '// This file was generated, do not edit manually\n\n'

// Clean out the destination
fs.rmSync(DEST_ROOT, { recursive: true, force: true })
fs.mkdirSync(DEST_ROOT, { recursive: true })

console.log('Prebuilding types')

for (const [dep, { version, src }] of Object.entries(dependencies)) {
  console.log(`Using ${dep} version: ${version}`)

  // Prepare destination for this dependency
  fs.mkdirSync(path.join(DEST_ROOT, dep), { recursive: true })

  // Get a list of files in this dependency
  const files = await glob(
    src.map(g => `./node_modules/${dep}/${g}`),
    { absolute: true },
  )

  // Generate artifact 1: Metadata
  fs.writeFileSync(
    `${DEST_ROOT}/${dep}/meta.js`,
    `${DISCLAIMER}export const version = "${version}"`,
  )
  const metaStream = fs.createWriteStream(`${DEST_ROOT}/${dep}/meta.js`)
  metaStream.write(DISCLAIMER)
  metaStream.write(`export const version = "${version}"\n\n`)
  metaStream.write('export const files = [')
  files.forEach(f => {
    const name = path.basename(f)
    metaStream.write(`\n  "${name}",`)
  })
  metaStream.write('\n]\n')
  metaStream.end()
  // Generate typedefs so Vite can import it with types
  fs.writeFileSync(
    `${DEST_ROOT}/${dep}/meta.d.ts`,
    `${DISCLAIMER}export const version: string;\nexport const files: string[];`,
  )

  // Generate artifact 2: A KV pair from file names to file content
  const dataStream = fs.createWriteStream(`${DEST_ROOT}/${dep}/data.js`)
  dataStream.write(DISCLAIMER)
  dataStream.write(`export const version = "${version}"\n\n`)
  dataStream.write('export const files = {')
  files.forEach(f => {
    const name = path.basename(f)
    const content = fs.readFileSync(path.resolve(f), 'utf8')
    dataStream.write(`\n"${name}": `)
    dataStream.write(`${JSON.stringify(content)},`)
  })
  dataStream.write('\n}\n')
  dataStream.end()
  // Generate typedefs so Vite can import it with types
  fs.writeFileSync(
    `${DEST_ROOT}/${dep}/data.d.ts`,
    `${DISCLAIMER}export const version: string;\nexport const files: Record<string,string>;`,
  )
}
