import { openAI } from './openAIClient.js'

const models = await openAI.listModels()

models.data
  .sort((a, b) => a.id.localeCompare(b.id))
  .forEach(({ id, owned_by, object, created }) => {
    console.log(
      `${id} (${owned_by}) created:${new Date(created * 1000).toISOString()}`
    )
  })
