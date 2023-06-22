import {openAI} from "./openAIClient.js";
import {fileURLToPath} from "url";
import path from "path";
import {fileToBlobWithFilename} from "./utils/fileToBlobWithFilename.js";
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const audioPath = path.join(__dirname,"../data/ozymandias.mp3")

const transcription = await openAI.createTranscription({
  requestBody: {
    model: 'whisper-1',
    file: fileToBlobWithFilename(audioPath),
    language: 'en',
  },
})

console.log(transcription.text)
