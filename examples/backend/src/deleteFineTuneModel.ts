import { openAI } from './openAIClient.js'

const fineTuneModel = 'curie:ft-acmeco-2021-03-03-21-44-20'

await openAI.deleteModel({
  parameter: {
    model: fineTuneModel,
  },
})
