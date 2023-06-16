import { BlobWithFilename } from 'openai-api-client'
import path from 'path'
import { readFileSync } from 'fs'

export const fileToBlobWithFilename = (filePath: string): BlobWithFilename => {
  const filename = path.basename(filePath)
  const buffer = readFileSync(filePath)

  return new BlobWithFilename([buffer], filename)
}
