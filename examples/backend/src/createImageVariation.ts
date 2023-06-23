import { openAI } from './openAIClient.js'
import path from 'path'
import { fileToBlobWithFilename } from './utils/fileToBlobWithFilename.js'
import { Buffer } from 'buffer'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const otterImagePath = path.join(__dirname, '../data/otter.png')
const generatedPath = path.join(__dirname, '../generated')

const imageVariation = await openAI.createImageVariation({
  requestBody: {
    image: fileToBlobWithFilename(otterImagePath),
    n: 2,
    size: '1024x1024',
    response_format: 'b64_json',
  },
})

imageVariation.data.forEach((data, index) => {
  const b64_json = data.b64_json

  if (b64_json) {
    const buffer = Buffer.from(b64_json, 'base64')
    writeFileSync(
      path.join(generatedPath, `ImageVariation_${index}.png`),
      buffer
    )
  }
})
