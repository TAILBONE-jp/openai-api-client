import { BlobWithFilename } from 'openai-api-client'
import path from 'path'
import { readFileSync } from 'fs'
import mime from 'mime-types'

export const fileToBlobWithFilename = (filePath: string): BlobWithFilename => {
  const filename = path.basename(filePath)
  const buffer = readFileSync(filePath)
  const type = mime.lookup(filename)
  if (type === false) {
    throw new Error(`Cannot lookup mime type: ${filename}`)
  }

  return new BlobWithFilename([buffer], type, filename)
}
