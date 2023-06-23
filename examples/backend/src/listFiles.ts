import { openAI } from './openAIClient.js'

const files = await openAI.listFiles()

files.data.forEach(({ id, filename, purpose, created_at, status }) => {
  console.log(
    `${id} ${filename} (${purpose}) Created:${new Date(
      created_at * 1000
    ).toISOString()} status:${status}`
  )
})
