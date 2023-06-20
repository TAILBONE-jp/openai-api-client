import * as path from 'path'
import { fileURLToPath } from 'url'
import { readdirSync, writeFileSync } from 'fs'
import { compileFromFile } from 'json-schema-to-typescript'
import { ensureDirSync } from 'fs-extra'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const jsonSchemaPath = path.join(__dirname, '../schema')
const generatedPath = path.join(__dirname, '../generated')

const main = async (): Promise<void> => {
  ensureDirSync(generatedPath)

  await Promise.all(
    readdirSync(jsonSchemaPath, { withFileTypes: true }).map(async (dirent) => {
      if (!dirent.isFile()) {
        return
      }

      const type = await compileFromFile(path.join(jsonSchemaPath, dirent.name))
      const splitted = dirent.name.split('.')
      splitted.pop()

      writeFileSync(
        path.join(generatedPath, splitted.join('.') + '.d.ts'),
        type
      )
    })
  )
}

void main()
