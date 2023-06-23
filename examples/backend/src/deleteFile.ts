import { openAI } from './openAIClient.js'

const deleteFile = await openAI.deleteFile({
  parameter: {
    file_id: 'file-CcvcjCwApoXzg10PkYXEY0ms',
  },
})

console.log(deleteFile)
