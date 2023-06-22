import { openAI } from './openAIClient.js'
import { Buffer } from 'buffer'
import { fileURLToPath } from 'url'
import path from 'path'
import { writeFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const response = await openAI.createImage({
  requestBody: {
    prompt: 'a white siamese cat',
    n: 1,
    size: '1024x1024',
    response_format: 'b64_json',
  },
})

const b64_json = response.data[0].b64_json

if (b64_json) {
  const buffer = Buffer.from(b64_json, 'base64')
  writeFileSync(path.join(__dirname, '../generated/out.png'), buffer)
}
