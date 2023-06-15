import {openAI} from "./openAIClient.js";
import {Schemas} from "openai-api-client";
import ChatCompletionRequestMessage = Schemas.ChatCompletionRequestMessage;

const chatCompletion = async () => {
  const messages: Array<ChatCompletionRequestMessage> = [
    {role: "user", content: "Please calculate (1+1)/0"},
  ]

  const completion = await openAI.createChatCompletion({
    requestBody: {
      model: "gpt-3.5-turbo-0613",
      messages
    }
  })

  console.log(completion.choices[0].message)
}

chatCompletion()
