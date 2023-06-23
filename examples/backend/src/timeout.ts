import { openAI } from './openAIClient.js'
import { clearTimeout } from 'timers'

const abortController = new AbortController()
const timeoutId = setTimeout(() => {
  abortController.abort()
}, 1000)

const completion = await openAI.createChatCompletion(
  {
    requestBody: {
      model: 'gpt-3.5-turbo-0613',
      messages: [{ role: 'user', content: 'Please calculate (1+1)/0' }],
    },
  },
  {
    signal: abortController.signal,
  }
)

clearTimeout(timeoutId)

console.log(completion.choices[0].message)
