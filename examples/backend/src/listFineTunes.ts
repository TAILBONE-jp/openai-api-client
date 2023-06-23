import { openAI } from './openAIClient.js'

const fineTunes = await openAI.listFineTunes()

fineTunes.data.forEach((fineTune) => {
  console.log(fineTune)
})
