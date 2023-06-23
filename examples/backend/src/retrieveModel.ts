import { openAI } from './openAIClient.js'

const model = await openAI.retrieveModel({
  parameter: {
    model: 'ada',
  },
})

console.log(
  `id:${model.id} object:${model.object} owned_by:${
    model.owned_by
  } created:${new Date(model.created * 1000).toISOString()} `
)
