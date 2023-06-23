import { openAI } from './openAIClient.js'
import { fileURLToPath } from 'url'
import path from 'path'
import { fileToBlobWithFilename } from './utils/fileToBlobWithFilename.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const germanAudioPath = path.join(__dirname, '../data/Wie-geht-es-dir.mp3')

const createTranslation = await openAI.createTranslation({
  requestBody: {
    model: 'whisper-1',
    file: fileToBlobWithFilename(germanAudioPath),
  },
})

console.log(createTranslation.text)
