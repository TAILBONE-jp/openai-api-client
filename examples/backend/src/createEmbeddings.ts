import { openAI } from './openAIClient.js'

const createEmbedding = await openAI.createEmbedding({
  requestBody: {
    input: 'The food was delicious and the waiter...',
    model: 'text-embedding-ada-002',
  },
})

console.log(createEmbedding.data)
