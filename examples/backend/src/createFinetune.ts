import { openAI } from './openAIClient.js'

const trainingFile = 'file-c9xmCaIZS7R9jlCS6bTjHr1D'

const { id, model, status, created_at } = await openAI.createFineTune({
  requestBody: {
    training_file: trainingFile,
    model: 'davinci',
  },
})

console.log(
  `id:${id} model:${model} status:${status} created_at:${new Date(
    created_at * 1000
  ).toISOString()}`
)
