import {openAI} from "./openAIClient.js";

const listFiles = async () => {
  const files = await openAI.listFiles()

  files.data.forEach(({filename, purpose, created_at, status}) => {
    console.log(`${filename} (${purpose}) Created:${new Date(created_at*1000).toISOString()} status:${status}`)
  })
}

listFiles()
