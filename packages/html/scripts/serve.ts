import cors from 'cors'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const port = 45245
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(cors())
app.use('/@trpc-playground/html', express.static(path.resolve(__dirname, '..')))

app.listen(port, () => {
  console.log(`CDN server listening at http://localhost:${port}`)
})
