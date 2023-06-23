import { existsSync, readFileSync, writeFileSync } from 'fs'
import { emptyDirSync, ensureDirSync } from 'fs-extra'

import { createRequire } from 'module'
import { execSync } from 'child_process'
import * as path from 'path'
import { fileURLToPath } from 'url'
import YAML from 'yaml'

const require = createRequire(import.meta.url)

const { CodeGenerator } = require('@himenon/openapi-typescript-code-generator')
const Templates = require('@himenon/openapi-typescript-code-generator/templates')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const remoteSchemaUrl =
  'https://raw.githubusercontent.com/openai/openai-openapi/master/openapi.yaml'
const generatedPath = path.join(__dirname, '../generated/')

const openApiSchemaPath = path.join(generatedPath, 'openapi.yml')
const etagPath = path.join(generatedPath, 'etag')

const mdPath = path.join(__dirname, '../README.md')

const distPath = path.join(__dirname, '../dist/')

const shouldDownloadSchema = async () => {
  let shouldDownload = false

  if (!existsSync(openApiSchemaPath)) {
    shouldDownload = true
  }

  if (existsSync(etagPath)) {
    const response = await fetch(remoteSchemaUrl, { method: 'HEAD' })
    const currentEtag = response.headers.get('etag')

    const savedEtag = readFileSync(etagPath, { encoding: 'utf-8' }).trim()
    shouldDownload = savedEtag != currentEtag
  } else {
    shouldDownload = true
  }

  return shouldDownload
}

const downloadSchema = async () => {
  const response = await fetch(remoteSchemaUrl)
  if (!response.ok) {
    throw new Error(`Cannot download schema from: ${remoteSchemaUrl}`)
  }

  const currentEtag = response.headers.get('etag')
  if (currentEtag) {
    writeFileSync(etagPath, currentEtag, { encoding: 'utf-8' })
  }

  const schemaData = await response.text()
  const yaml = YAML.parse(schemaData)
  const version: string | undefined = yaml.info?.version

  if (version === undefined) {
    throw new Error(`Cannot parse schema at: ${remoteSchemaUrl}`)
  }
  console.log(`Downloaded schema version: ${version}`)

  const md = readFileSync(mdPath, { encoding: 'utf-8' })
  const updatedMd = md.replace(
    /Current schema version is:.*$/gm,
    `Current schema version is: ${version}`
  )
  writeFileSync(mdPath, updatedMd)

  writeFileSync(openApiSchemaPath, schemaData)
}

const main = async (): Promise<void> => {
  ensureDirSync(generatedPath)

  if (await shouldDownloadSchema()) {
    await downloadSchema()
  } else {
    console.log('Using current schema.')
  }

  const codeGenerator = new CodeGenerator(openApiSchemaPath, {
    convertOption: {
      formatConversions: [
        {
          selector: {
            format: 'binary',
          },
          output: {
            type: ['string', 'BlobWithFilename'],
          },
        },
      ],
    },
  })
  codeGenerator.validateOpenApiSchema()

  let code: string = codeGenerator.generateTypeDefinition([
    codeGenerator.getAdditionalTypeDefinitionCustomCodeGenerator(),
    {
      generator: Templates.ClassApiClient.generator,
      option: {},
    },
  ])

  code += [
    '',
    'export class BlobWithFilename extends Blob {',
    '  filename: string',
    '  constructor(blobPart: BlobPart[], type: string, filename: string) {',
    '    super(blobPart, { type })',
    '    this.filename = filename',
    '  }',
    '}',
  ].join('\n')

  writeFileSync(`${generatedPath}/apiClient.ts`, code, {
    encoding: 'utf-8',
  })

  emptyDirSync(distPath)
  execSync('pnpm exec tsc --project tsconfig.build.esm.json', {
    encoding: 'utf-8',
  })
  execSync('pnpm exec tsc --project tsconfig.build.cjs.json', {
    encoding: 'utf-8',
  })
  execSync('pnpm exec tsconfig-to-dual-package', { encoding: 'utf-8' })
}

void main()
