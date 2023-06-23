import { openAI } from './openAIClient.js'

const createModeration = await openAI.createModeration({
  requestBody: {
    input: 'I want to kill them.',
    model: 'text-moderation-latest',
  },
})

console.log(createModeration.results[0])
