import {Schemas} from "openai-api-client";
import {openAI} from "./openAIClient.js";

import getCurrentWeatherSchema from "../schema/get_current_weather.json" assert {type: "json"};
import {GetCurrentWeather} from "../generated/get_current_weather.js"
import ChatCompletionResponseMessage = Schemas.ChatCompletionResponseMessage;

// see: https://platform.openai.com/docs/guides/gpt/function-calling

const functionCalling = async () => {
  const model = "gpt-3.5-turbo-0613"

  // Example dummy function hard coded to return the same weather
  // In production, this could be your backend API or an external API
  const getCurrentWeather = ({location, unit}: { location: string, unit?: string }) => {
    const weather_info = {
      "location": location,
      "temperature": "72",
      "unit": unit || "fahrenheit",
      "forecast": ["sunny", "windy"],
    }

    return JSON.stringify(weather_info)
  }

  // Step 1, send model the user query and what functions it has access to
  const completion = await openAI.createChatCompletion({
    requestBody: {
      model,
      messages: [{
        "role": "user", "content": "What's the weather like in Boston?"
      }],
      functions: [
        {
          "name": "get_current_weather",
          "description": "Get the current weather in a given location",
          "parameters": getCurrentWeatherSchema,
        }
      ],
      function_call: "auto"
    }
  })

  type ChatCompletionResponseMessageWithGetCurrentWeather =
    ChatCompletionResponseMessage & GetCurrentWeather
    | undefined;

  const message = completion.choices[0].message as
    ChatCompletionResponseMessageWithGetCurrentWeather

  // Step 2, check if the model wants to call a function
  if (message?.function_call) {
    const functionName = message.function_call.name

    // Step 3, call the function
    // Note: the JSON response from the model may not be valid JSON
    const functionResponse = getCurrentWeather({
      location: message.location,
      unit: message.unit
    })

    // Step 4, send model the info on the function call and function response
    const secondResponse = await openAI.createChatCompletion(
      {
        requestBody: {
          model,
          messages: [
            {"role": "user", "content": "What is the weather like in boston?"},
            message,
            {
              "role": "function",
              "name": functionName,
              "content": functionResponse,
            },
          ]
        }
      }
    )

    console.log(secondResponse.choices[0].message)
  }
}

functionCalling();
