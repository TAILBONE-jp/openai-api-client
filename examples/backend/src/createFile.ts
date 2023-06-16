import path from 'path'
import { fileURLToPath } from 'url'
import { openAI } from './openAIClient.js'
import { fileToBlobWithFilename } from './utils/fileToBlobWithFilename.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const filePath = path.join(__dirname, '../data/training-dummy-data.jsonl')

const createFile = async (): Promise<void> => {
  const { filename, purpose, created_at, status } = await openAI.createFile({
    requestBody: {
      file: fileToBlobWithFilename(filePath),
      purpose: 'fine-tune'
    }
  })

  console.log(`${filename} (${purpose}) Created:${new Date(created_at * 1000).toISOString()} status:${status}`)
}

void createFile()
