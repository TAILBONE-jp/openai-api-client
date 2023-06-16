const {OpenAIApi, DefaultThrottleManagerServiceImpl} = require("openai-api-client")

const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY
const CHATGPT_ORGANIZATION_ID = process.env.CHATGPT_ORGANIZATION_ID

if (!CHATGPT_ORGANIZATION_ID || !CHATGPT_API_KEY) {
  throw new Error("CHATGPT_ORGANIZATION_ID or CHATGPT_API_KEY is not defined")
}

exports.openAI = OpenAIApi({
  organization: CHATGPT_ORGANIZATION_ID,
  apiKey: CHATGPT_API_KEY,
  throttleManagerService: new DefaultThrottleManagerServiceImpl(CHATGPT_ORGANIZATION_ID),
})
