import { openAI } from './openAIClient.js'
import { Schemas } from '../../../generated/apiClient.js'
import FineTuneEvent = Schemas.FineTuneEvent

const fineTuneId = 'ft-3hdwiNtrDdVToqccSZ8XJ26U'

await openAI.listFineTuneEvents(
  {
    parameter: {
      fine_tune_id: fineTuneId,
      stream: true,
    },
  },
  {
    onMessage: (json: FineTuneEvent) => {
      console.log(json)
    },
  }
)
