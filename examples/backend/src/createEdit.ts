import { openAI } from './openAIClient.js'

const createEdit = await openAI.createEdit({
  requestBody: {
    model: 'text-davinci-edit-001',
    input: 'What day of the wek is it?',
    instruction: 'Fix the spelling mistakes',
  },
})

console.log(createEdit.choices[0].text)
