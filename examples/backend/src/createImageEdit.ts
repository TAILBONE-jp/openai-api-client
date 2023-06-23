import { openAI } from './openAIClient.js'
import { fileToBlobWithFilename } from './utils/fileToBlobWithFilename.js'
import { fileURLToPath } from 'url'
import path from 'path'
import { Buffer } from 'buffer'
import { writeFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const otterImagePath = path.join(__dirname, '../data/otter.png')
const maskImagePath = path.join(__dirname, '../data/mask.png')
const generatedPath = path.join(__dirname, '../generated')

const createImageEdit = await openAI.createImageEdit({
  requestBody: {
    // image & mask must be PNG less than 4MB and format must be in ['RGBA', 'LA', 'L']
    image: fileToBlobWithFilename(otterImagePath),
    mask: fileToBlobWithFilename(maskImagePath),
    prompt: 'A cute baby sea otter wearing a beret',
    n: 2,
    size: '1024x1024',
    response_format: 'b64_json',
  },
})

createImageEdit.data.forEach((data, index) => {
  const b64_json = data.b64_json

  if (b64_json) {
    const buffer = Buffer.from(b64_json, 'base64')
    writeFileSync(path.join(generatedPath, `ImageEdit_${index}.png`), buffer)
  }
})
