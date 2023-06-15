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

  const tasks = files.data.map(({id, filename, purpose, bytes, created_at}) => async () => {
    try {
      console.log(`Downloading: ${filename} (${purpose}) ${bytes}bytes Created at:${new Date(created_at * 1000).toISOString()}`)
      const content: string = await openAI.downloadFile({
        parameter: {
          file_id: id
        }
      })

      writeFileSync(path.join(downloadPath, filename), content)
    } catch (e) {
      console.error(e)
    }
  })

  const pqueue = new PQueue({concurrency: 1})
  await pqueue.addAll(tasks)
}

downloadFiles()
