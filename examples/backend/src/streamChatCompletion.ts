import process from 'process'
import { openAI } from './openAIClient.js'
import { CreateChatCompletionStreamResponse } from 'openai-api-client'

const streamChatCompletion = async () => {

  const abortController = new AbortController()
  const timeoutId = setTimeout(() => abortController.abort(), 1000 * 10)

  void openAI.createChatCompletion({
    requestBody: {
      model: 'gpt-3.5-turbo-0613',
      stream: true,
      messages: [
        {
          role: 'user',
          content: 'Please explain yourself and predict the future of the relationships between you and human.',
        }
      ]
    }
  }, {
    onOpen: () => {
      console.log('\n[onOpen]')
    },
    onMessage: (json: CreateChatCompletionStreamResponse) => {
      const content = json.choices[0].delta?.content
      if (content) {
        process.stdout.write(content)
      }
    },
    onClose: () => {
      console.log('\n[onClose]')
      clearTimeout(timeoutId)
    },
    signal: abortController.signal
  })
}

void streamChatCompletion()
