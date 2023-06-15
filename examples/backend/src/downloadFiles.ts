import {openAI} from "./openAIClient.js";
import {writeFileSync} from "fs";
import path from "path";
import {fileURLToPath} from "url";
import {ensureDirSync} from "fs-extra";
import PQueue from "p-queue"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const downloadPath = path.join(__dirname, "../download/")

const downloadFiles = async () => {
  ensureDirSync(downloadPath)
  const files = await openAI.listFiles()

  const tasks = files.data.map(file => async () => {
    console.log(`Downloading: ${file.filename}`)
    const content = await openAI.downloadFile({
        parameter: {
          file_id: file.id
        }
      },
      {
        headers: {
          "Accept": "*/*"
        }
      })

    console.log(content)
    writeFileSync(path.join(downloadPath, file.filename), content)
  })

  const pqueue = new PQueue({concurrency: 1})
  await pqueue.addAll(tasks)
}

downloadFiles()
