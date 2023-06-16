# OpenAI Client Library
Yet another OpenAI client for both frontend (ex. React) and backend (Node.js) with TypeScript.

### Requirements
* Node.js >= 18.0.0 since this library uses the experimental implementation of fetch
to avoid dependencies with 3rd party libraries as possible.

### Recommendation
You should setup a proxy at backend code to avoid passing secret API key between frontend and backend.

Do not leak your keys in public!

### Features
* Can use with both frontend and backend codes.
* Dual package (CommonJS & ESModules)
* Sync with the [OpenAPI schema](https://raw.githubusercontent.com/openai/openai-openapi/master/openapi.yaml) provided by OpenAI officially. Current schema version is: 1.3.0
* Streaming completions (`stream=true`) are supported.
* Basic implementation for throttle management.

## Installation
```bash
npm install openai-api-client
```

## Setup for frontend
```typescript
import {OpenAIApi, VoidThrottleManagerServiceImpl} from "openai-api-client";

const openAI = OpenAIApi({
  baseUrl: "/api/openai", // URL of a proxy implemented at backend
  throttleManagerService: new VoidThrottleManagerServiceImpl() // Do not care about rate limit
})
```

## Setup for backend
```typescript
import {OpenAIApi, DefaultThrottleManagerServiceImpl} from "openai-api-client";

const openAI = OpenAIApi({
  apiKey: CHATGPT_API_KEY,
  organization: CHATGPT_ORGANIZATION_ID,
  throttleManagerService: new DefaultThrottleManagerServiceImpl(CHATGPT_ORGANIZATION_ID)
})
```

## API Examples

### List Models
see: https://platform.openai.com/docs/api-reference/models/list
<details>
  <summary>Code</summary>

```typescript
const models = await openAI.listModels()

models.data
  .sort((a, b) => a.id.localeCompare(b.id))
  .forEach(({id, owned_by, object, created}) => {
    console.log(`${id} (${owned_by}) created:${new Date(created * 1000).toISOString()}`)
  })
```

#### Result
```text
ada (openai) created:2022-04-07T18:51:31.000Z
ada-code-search-code (openai-dev) created:2022-04-28T19:01:45.000Z
ada-code-search-text (openai-dev) created:2022-04-28T19:01:50.000Z
...
```
</details>

### Chat Completion
see: https://platform.openai.com/docs/api-reference/chat/create

<details>
  <summary>Code</summary>

```typescript
import {Schemas} from "openai-api-client";
import ChatCompletionRequestMessage = Schemas.ChatCompletionRequestMessage;

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
```

#### Result
```text
{
  role: 'assistant',
  content: 'The expression (1+1)/0 is undefined. Dividing any number by zero is undefined in mathematics.'
}
```
</details>

### Streaming Chat Completion
see: https://platform.openai.com/docs/api-reference/chat/create#chat/create-stream

<details>
  <summary>Code</summary>

```typescript
import {
  CreateChatCompletionStreamResponse,
  RequestInitWithCallbacks,
} from "openai-api-client";

// should be void.
void openAI.createChatCompletion({
  requestBody: {
    ..., // pass parameters (see OpenAI's API docs)
    stream: true
  }
}, {
  // Callback function when streaming begins.
  onOpen: () => { ... },
  // Callback function when receiving delta.
  onMessage: (json: CreateChatCompletionStreamResponse) => {
    // or cast 'json' variable with CreateCompletionStreamResponse type
    // if you call openAI.createCompletion
    ...
  },
  // Callback function when streaming ends.
  onClose: () => { ... }
})
```
</details>

### List Files
see: https://platform.openai.com/docs/api-reference/files/list

<details>
  <summary>Code</summary>

```typescript
const files = await openAI.listFiles()

files.data.forEach(({filename, purpose, created_at, status}) => {
  console.log(`${filename} (${purpose}) Created:${new Date(created_at*1000).toISOString()} status:${status}`)
})
```
#### Result
```text
compiled_results.csv (fine-tune-results) Created:2023-05-19T01:19:55.000Z status:processed
training-data.jsonl (fine-tune) Created:2023-05-19T01:15:35.000Z status:processed
```
</details>

### Create File
see: https://platform.openai.com/docs/api-reference/files/upload

<details>
  <summary>Code</summary>

```typescript
const {filename, purpose, created_at, status} = await openAI.createFile({
  requestBody: {
    file: fileToBlobWithFilename(filePath),
    purpose: "fine-tune"
  }
})

console.log(`${filename} (${purpose}) Created:${new Date(created_at * 1000).toISOString()} status:${status}`)
```

#### fileToBlobWithFilename (for backend)
This library does not contain code for making BlobWithFilename object
as it will cause conflicts between frontend and backend environment.
```typescript
import {BlobWithFilename} from "openai-api-client";
import path from "path";
import {readFileSync} from "fs";

const fileToBlobWithFilename = (filePath: string): BlobWithFilename => {
  const filename = path.basename(filePath)
  const buffer = readFileSync(filePath)

  return new BlobWithFilename([buffer], filename)
}
```

#### Result
```text
training-dummy-data.jsonl (fine-tune) Created:2023-06-15T12:42:27.000Z status:uploaded
```
</details>


### Download File
see: https://platform.openai.com/docs/api-reference/files/retrieve-content

<details>
  <summary>Code</summary>

```typescript
const content: string = await openAI.downloadFile({
  parameter: {
    file_id: id
  }
})
```
</details>


### Function Calling
see: https://platform.openai.com/docs/guides/gpt/function-calling

<details>
  <summary>Code</summary>

```typescript
import {Schemas} from "openai-api-client";
import ChatCompletionResponseMessage = Schemas.ChatCompletionResponseMessage;

import getCurrentWeatherSchema from "../schema/get_current_weather.json" assert {type: "json"};

// Generated by "json-schema-to-typescript" library
import {GetCurrentWeather} from "../generated/get_current_weather.js"

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
```

#### get_current_weather.json
```json
{
  "type": "object",
  "properties": {
    "location": {
      "type": "string",
      "description": "The city and state, e.g. San Francisco, CA"
    },
    "unit": {
      "type": "string",
      "enum": [
        "celsius",
        "fahrenheit"
      ]
    }
  },
  "required": [
    "location"
  ]
}
```

#### get_current_weather.d.ts
```typescript
/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface GetCurrentWeather {
  /**
   * The city and state, e.g. San Francisco, CA
   */
  location: string;
  unit?: "celsius" | "fahrenheit";
  [k: string]: unknown;
}
```

#### Result
```text
{
  role: 'assistant',
  content: 'The current weather in Boston, MA is sunny with a temperature of 72°F. It is also windy.'
}
```
</details>


### Set timeout
```typescript
const abortController = new AbortController()
const timeoutId = setTimeout(() => abortController.abort(), 1000 * 1) // too short timeout for testing

const completion = await openAI.createChatCompletion({
  requestBody: {
    model: "gpt-3.5-turbo-0613",
    messages: [{role: "user", content: "Please calculate (1+1)/0"}]
  }
}, {
  signal: abortController.signal  // 2nd parameter accepts RequestInit object passed to fetch
})

clearTimeout(timeoutId)
console.log(completion.choices[0].message)
```
#### Result
```text
DOMException [AbortError]: This operation was aborted
```

### Customize Throttle Manager

```typescript
import {AbstractThrottleManagerService, ResetParams} from "openai-api-client";

class MyThrottleManagerServiceImpl extends AbstractThrottleManagerService {
  constructor(id: string) {
    super(id)
    // write your codes
  }

  // Called before fetching
  async wait(): Promise<void> {
    // write your codes
  }

  // Receive response from fetch and reset internal state
  async reset(params: ResetParams): Promise<void> {
    // write your codes
  }
}

const openAI = OpenAIApi({
  ... // write parameters
  throttleManagerService: new MyThrottleManagerServiceImpl(CHATGPT_ORGANIZATION_ID)
})
```

### CommonJS

```javascript
const {openAI} = require("./openAIClient.js");

const listModels = async () => {
  const models = await openAI.listModels()

  models.data
    .sort((a, b) => a.id.localeCompare(b.id))
    .forEach(({id, owned_by, created}) => {
      console.log(`${id} (${owned_by}) created:${new Date(created * 1000).toISOString()}`)
    })
}
```
#### openAIClient.js
```javascript
const {OpenAIApi, DefaultThrottleManagerServiceImpl} = require("openai-api-client")

exports.openAI = OpenAIApi({
  organization: CHATGPT_ORGANIZATION_ID,
  apiKey: CHATGPT_API_KEY,
  throttleManagerService: new DefaultThrottleManagerServiceImpl(CHATGPT_ORGANIZATION_ID),
})
```

## Support
[Issue tracker](https://github.com/TAILBONE-jp/openai-api-client/issues)

## License
[MIT License](https://github.com/TAILBONE-jp/openai-api-client/blob/HEAD/LICENSE)

## Disclaimer
This is unofficial client library and not endorsed by OpenAI.
