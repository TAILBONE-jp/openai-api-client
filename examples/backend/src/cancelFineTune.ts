import { openAI } from './openAIClient.js'

const fineTuneId = 'ft-3hdwiNtrDdVToqccSZ8XJ26U'

const fineTune = await openAI.cancelFineTune({
  parameter: {
    fine_tune_id: fineTuneId,
  },
})

console.log(fineTune)
