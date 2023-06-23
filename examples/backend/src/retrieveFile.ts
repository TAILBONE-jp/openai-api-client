import { openAI } from './openAIClient.js'

const { bytes, created_at, purpose, filename } = await openAI.retrieveFile({
  parameter: {
    file_id: 'file-CcvcjCwApoXzg10PkYXEY0ms',
  },
})

console.log(
  `${filename} (${purpose}) ${bytes}bytes createdAt:${new Date(
    created_at * 1000
  ).toISOString()}`
)
