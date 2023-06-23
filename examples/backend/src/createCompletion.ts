import { openAI } from './openAIClient.js'

const completion = await openAI.createCompletion({
  requestBody: {
    model: 'text-davinci-003',
    prompt: 'Say this is a test',
  },
})

console.log(completion.choices[0].text)
