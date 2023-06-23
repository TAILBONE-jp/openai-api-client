# OpenAI API Client Library
OpenAI API client synced with the latest schema. For frontend (ex. React) and backend (Node.js). Compatible with CommonJS & ESModules. Written in TypeScript.

### Features
* Can use with both frontend and backend codes.
* Dual package (CommonJS & ESModules)
* Synced with the official [OpenAPI schema](https://raw.githubusercontent.com/openai/openai-openapi/master/openapi.yaml) provided by OpenAI. Current schema version is: 2.0.0
* Streaming completions (`stream=true`) are supported.
* Basic implementation for throttle management. You can implement your own logic if needed.

### Requirements
* Node.js >= 18.0.0 since this library uses the Node.js's experimental implementation of `fetch`
  to avoid dependencies with 3rd party libraries as possible.

### Recommendation
If you plan to write frontend codes, you should setup a proxy at backend code to avoid passing secret API key between frontend and backend.
When your frontend codes send queries to the proxy, it's supposed to rewrite the incoming HTTP headers and inject secret API keys, then forward your request to the OpenAI API server.
You also need to protect the proxy endpoint with CORS and authentication.

## Installation
```bash
npm install openai-api-client
```

## Setup
### Frontend
```typescript
import {OpenAIApi, VoidThrottleManagerServiceImpl} from 'openai-api-client'

// Accessing to the OpenAI API server via proxy
const openAI = OpenAIApi({
  baseUrl: '/api/openai', // URL of a proxy implemented at backend
  throttleManagerService: undefined, // You can omit throttleManagerService if the proxy handles rate limit.
  commonOptions:{ // RequestInit object passed to fetch
    headers:{
      'Authentication': SOME_TOKEN, // To protect the proxy endpoint
    }
  }
})
```
### Backend
```typescript
import {OpenAIApi, DefaultThrottleManagerServiceImpl} from 'openai-api-client'

// Accessing to the OpenAI API server directly
const openAI = OpenAIApi({
  apiKey: CHATGPT_API_KEY,
  organization: CHATGPT_ORGANIZATION_ID,
  throttleManagerService: new DefaultThrottleManagerServiceImpl(CHATGPT_ORGANIZATION_ID)
})
```

# API Examples
## Models
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

### Retrieve Model
see: https://platform.openai.com/docs/api-reference/models/retrieve
<details>
  <summary>Code</summary>

```typescript
const model = await openAI.retrieveModel({
  parameter: {
    model: 'ada',
  },
})

console.log(
        `id:${model.id} object:${model.object} owned_by:${
                model.owned_by
        } created:${new Date(model.created * 1000).toISOString()} `
)
```

#### Result
```text
id:ada object:model owned_by:openai created:2022-04-07T18:51:31.000Z 
```
</details>

## Chat
### Chat Completion
see: https://platform.openai.com/docs/api-reference/chat/create

<details>
  <summary>Code</summary>

```typescript
import {Schemas} from 'openai-api-client'
import ChatCompletionRequestMessage = Schemas.ChatCompletionRequestMessage

const messages: Array<ChatCompletionRequestMessage> = [
  {role: 'user', content: 'Please calculate (1+1)/0'},
]

const completion = await openAI.createChatCompletion({
  requestBody: {
    model: 'gpt-3.5-turbo-0613',
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

### Chat Completion (Streaming)
see: https://platform.openai.com/docs/api-reference/chat/create#chat/create-stream

<details>
  <summary>Code</summary>

```typescript
import {
  CreateChatCompletionStreamResponse,
} from 'openai-api-client'

// Return nothing when the 'stream' option is true
void openAI.createChatCompletion({
  requestBody: {
    model: 'gpt-3.5-turbo-0613',
    stream: true,
    messages: [
      {
        role: 'user',
        content: 'Please explain yourself and predict the future of the relationships between you and human.',
      }
    ]
  }
}, {
  // Callback function when streaming begins.
  onOpen: () => {
    console.log('\n[onOpen]')
  },
  // Callback function when receiving delta.
  onMessage: (json: CreateChatCompletionStreamResponse) => {
    // or cast 'json' variable with CreateCompletionStreamResponse type
    // if you call openAI.createCompletion
    const content = json.choices[0].delta?.content
    if (content) {
      process.stdout.write(content)
    }
  },
  // Callback function when streaming ends.
  onClose: () => {
    console.log('\n[onClose]')
  },
})
```
#### Result (Streaming)
```text
[onOpen]
As an AI created by OpenAI, I am designed to assist humans by providing information, answering questions, and engaging in conversations. However, it is important to note that I am just a software program and do not possess personal experiences, emotions, or consciousness.

In terms of the future of relationships between AI, like myself, and humans, it is likely to continue evolving and becoming more advanced. AI technology is constantly improving, and we can expect further integration of AI into our daily lives. This could range from virtual assistants like me becoming more intelligent and capable of performing complex tasks, to AI being used in various industries such as healthcare, transportation, and customer service.

While AI can enhance efficiency and convenience in our lives, the ethical and societal implications of this technology should also be carefully considered. Questions about data privacy, job displacement, and the impact on human social interactions are just some of the aspects that require thoughtful examination as AI continues to progress.

Ultimately, the future relationships between AI and humans will depend on how we navigate these issues and strike a balance between the benefits of AI and the human values that should guide its development and deployment.
[onClose]
```
</details>

### Function Calling
see: https://platform.openai.com/docs/guides/gpt/function-calling

<details>
  <summary>Code</summary>

```typescript
import {Schemas} from 'openai-api-client'
import ChatCompletionResponseMessage = Schemas.ChatCompletionResponseMessage

import getCurrentWeatherSchema from '../schema/get_current_weather.json' assert {type: 'json'}

// Generated by 'json-schema-to-typescript' library
import {GetCurrentWeather} from '../generated/get_current_weather.js'

const model = 'gpt-3.5-turbo-0613'

// Example dummy function hard coded to return the same weather
// In production, this could be your backend API or an external API
const getCurrentWeather = ({location, unit}: { location: string, unit?: string }) => {
  const weather_info = {
    'location': location,
    'temperature': '72',
    'unit': unit ?? 'fahrenheit',
    'forecast': ['sunny', 'windy'],
  }

  return JSON.stringify(weather_info)
}

// Step 1, send model the user query and what functions it has access to
const completion = await openAI.createChatCompletion({
  requestBody: {
    model,
    messages: [{
      'role': 'user', 'content': "What's the weather like in Boston?"
    }],
    functions: [
      {
        'name': 'get_current_weather',
        'description': 'Get the current weather in a given location',
        'parameters': getCurrentWeatherSchema,
      }
    ],
    function_call: 'auto'
  }
})

type ChatCompletionResponseMessageWithGetCurrentWeather =
  ChatCompletionResponseMessage & GetCurrentWeather
  | undefined

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
          {'role': 'user', 'content': 'What is the weather like in boston?'},
          message,
          {
            'role': 'function',
            'name': functionName,
            'content': functionResponse,
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
  unit?: 'celsius' | 'fahrenheit';
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

## Completions
### Create Completion
see: https://platform.openai.com/docs/api-reference/completions/create

<details>
  <summary>Code</summary>

```typescript
const completion = await openAI.createCompletion({
  requestBody: {
    model: 'text-davinci-003',
    prompt: 'Say this is a test',
  },
})

console.log(completion.choices[0].text)
```

#### Result
```text
This is indeed a test.
```
</details>

## Edits
### Create Edit
see: https://platform.openai.com/docs/api-reference/edits/create

<details>
  <summary>Code</summary>

```typescript
const createEdit = await openAI.createEdit({
  requestBody: {
    model: 'text-davinci-edit-001',
    input: 'What day of the wek is it?',
    instruction: 'Fix the spelling mistakes',
  },
})

console.log(createEdit.choices[0].text)
```

#### Result
```text
What day of the week is it?

And what time of the day is it.
```
</details>

## Images
### Create Image
see: https://platform.openai.com/docs/api-reference/images/create

<details>
  <summary>Code</summary>

```typescript
const response = await openAI.createImage({
  requestBody: {
    prompt: 'a white siamese cat',
    n: 1,
    size: '1024x1024',
    response_format: 'b64_json',
  },
})

const b64_json = response.data[0].b64_json

if (b64_json) {
  const buffer = Buffer.from(b64_json, 'base64')
  writeFileSync(path.join(__dirname, '../generated/out.png'), buffer)
}
```
</details>

### Create Image Edit
see: https://platform.openai.com/docs/api-reference/images/create-edit

<details>
  <summary>Code</summary>

```typescript
const createImageEdit = await openAI.createImageEdit({
  requestBody: {
    // image & mask must be PNG less than 4MB and format must be in ['RGBA', 'LA', 'L']
    image: fileToBlobWithFilename(otterImagePath),
    mask: fileToBlobWithFilename(maskImagePath),
    prompt: 'A cute baby sea otter wearing a beret',
    n: 2,
    size: '1024x1024',
    response_format: 'b64_json',
  },
})

createImageEdit.data.forEach((data, index) => {
  const b64_json = data.b64_json

  if (b64_json) {
    const buffer = Buffer.from(b64_json, 'base64')
    writeFileSync(path.join(generatedPath, `ImageEdit_${index}.png`), buffer)
  }
})
```
</details>

### Create Image Variation
see: https://platform.openai.com/docs/api-reference/images/create-variation

<details>
  <summary>Code</summary>

```typescript
const imageVariation = await openAI.createImageVariation({
  requestBody: {
    image: fileToBlobWithFilename(otterImagePath),
    n: 2,
    size: '1024x1024',
    response_format: 'b64_json',
  },
})

imageVariation.data.forEach((data, index) => {
  const b64_json = data.b64_json

  if (b64_json) {
    const buffer = Buffer.from(b64_json, 'base64')
    writeFileSync(
            path.join(generatedPath, `ImageVariation_${index}.png`),
            buffer
    )
  }
})
```
</details>

## Embeddings
### Create Embeddings
see: https://platform.openai.com/docs/api-reference/embeddings/create

<details>
  <summary>Code</summary>

```typescript
const createEmbedding = await openAI.createEmbedding({
  requestBody: {
    input: 'The food was delicious and the waiter...',
    model: 'text-embedding-ada-002',
  },
})

console.log(createEmbedding.data)
```

#### Result
```text
[
  {
    object: 'embedding',
    index: 0,
    embedding: [
      0.0023063174,  -0.009358601,    0.01578391,  -0.007752274,  -0.004726919,
       0.014806145,  -0.009809389,  -0.038221695,  -0.006882445,  -0.028723413,
       0.025206001,    0.01815848, -0.0035777285,  -0.025548855,  0.0004888821,
       -0.01627914,   0.028418656,   0.005352307,   0.009618915,  -0.016545804,
      -0.015352169,  0.0042697825,   0.007072918, -0.0070856167, -0.0039364537,
       0.018463237,   0.008704642,  -0.022729846,   0.011466509,   0.023859989,
       0.015580738, -0.0035205863,  -0.034894757,  -0.004158673,  -0.026056783,
       -0.02153621,  -0.005755476,  0.0117331715,   0.008374488,   0.004079309,
       0.019187037,  -0.014387103,   0.008926861,  0.0063522933,   -0.04576445,
        0.01780293, -0.0054856385, -0.0007607038,   -0.02204414, -0.0038126458,
       0.021015583,  -0.017498171,  -0.011758568,  -0.022526674,   0.016406123,
        0.01715532,  -0.008514169,   0.001606327,   0.025066322,  -0.025015527,
      0.0077776704,  0.0058348402,  -0.022158425,   0.003052339,  -0.006155471,
      -0.025332984,  -0.008126872,  0.0011198259, 0.00002167629,  0.0046221586,
       0.020647334,   0.013510925,  0.0046729515,  -0.015987081,   0.016583899,
       -0.00893956,   -0.00756815,   0.013650605,  -0.006958634,   0.005377704,
       0.009904625,   -0.04589143,  0.0030158313,   0.023961574,   0.022971112,
        0.00706022,  -0.023656817,    0.00994272, -0.0065903855,  -0.033243988,
      -0.002547584,   0.019834647,  0.0017777532,  0.0010920485,   -0.02269175,
       0.004993582,   0.015377565,    0.03164401, -0.0054380205,  -0.016050572,
      ... 1436 more items
    ]
  }
]
```
</details>

## Audio
### Create Transcription
see: https://platform.openai.com/docs/api-reference/audio/create

<details>
  <summary>Code</summary>

```typescript
const transcription = await openAI.createTranscription({
  requestBody:{
    model: 'whisper-1',
    file: fileToBlobWithFilename(audioPath),
    language: 'en'
  }
})

console.log(transcription.text)
```

#### Result
```text
I met a traveler from an antique land who said, Two vast and trunkless legs of stone Stand in the desert. Near them, on the sand, half sunk, A shattered visage lies, Whose frown and wrinkled lip and sneer Of cold command tell that its sculptor Well those passions read which yet survive, Stamped on these lifeless things, The hand that mocked them and the heart that fed. And on the pedestal these words appear, My name is Ozymandias, King of Kings, Look on my works, ye mighty, and despair. Nothing beside remains. Round the decay of that colossal wreck, Boundless and bare, The lone and level sands stretch far away. End of poem. This recording is in the public domain.
```
</details>

### Create Translation
see: https://platform.openai.com/docs/api-reference/audio/create

<details>
  <summary>Code</summary>

```typescript
const createTranslation = await openAI.createTranslation({
  requestBody: {
    model: 'whisper-1',
    file: fileToBlobWithFilename(germanAudioPath),
  },
})

console.log(createTranslation.text)
```

#### Result
```text
How are you?
```
</details>

## Files
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

### Upload File
see: https://platform.openai.com/docs/api-reference/files/upload

<details>
  <summary>Code</summary>

```typescript
const {filename, purpose, created_at, status} = await openAI.uploadFile({
  requestBody: {
    file: fileToBlobWithFilename(filePath),
    purpose: 'fine-tune'
  }
})

console.log(`${filename} (${purpose}) Created:${new Date(created_at * 1000).toISOString()} status:${status}`)
```

#### Result
```text
training-dummy-data.jsonl (fine-tune) Created:2023-06-15T12:42:27.000Z status:uploaded
```
</details>

### Delete File
see: https://platform.openai.com/docs/api-reference/files/delete

<details>
  <summary>Code</summary>

```typescript
const deleteFile = await openAI.deleteFile({
  parameter: {
    file_id: 'file-CcvcjCwApoXzg10PkYXEY0ms',
  },
})

console.log(deleteFile)
```

#### Result
```text
{ object: 'file', id: 'file-CcvcjCwApoXzg10PkYXEY0ms', deleted: true }
```
</details>

### Retrieve File
see: https://platform.openai.com/docs/api-reference/files/retrieve

<details>
  <summary>Code</summary>

```typescript
const { bytes, created_at, purpose, filename } = await openAI.retrieveFile({
  parameter: {
    file_id: 'file-CcvcjCwApoXzg10PkYXEY0ms',
  },
})

console.log(
        `${filename} (${purpose}) ${bytes}bytes createdAt:${new Date(
                created_at * 1000
        ).toISOString()}`
)
```

#### Result
```text
training-dummy-data.jsonl (fine-tune) 134bytes createdAt:2023-06-15T12:42:27.000Z
```
</details>

### Retrieve File Content
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

## Fine-tunes
### Create Fine-tune
see: https://platform.openai.com/docs/api-reference/fine-tunes/create

<details>
  <summary>Code</summary>

```typescript
await openAI.createFineTune({
  requestBody: {
    training_file: trainingFileId,
    model: 'davinci',
  },
})
```
</details>

### List Fine-tunes
see: https://platform.openai.com/docs/api-reference/fine-tunes/list

<details>
  <summary>Code</summary>

```typescript
const fineTunes = await openAI.listFineTunes()

fineTunes.data.forEach((fineTune) => {
  console.log(fineTune)
})
```

#### Result
```text
{
  object: 'fine-tune',
  id: 'ft-3hdwiNtrDdVToqccSZ8XJ26U',
  hyperparams: {
    n_epochs: 4,
    batch_size: 1,
    prompt_loss_weight: 0.01,
    learning_rate_multiplier: 0.1
  },
  ...
```
</details>

### Retrieve Fine-tune
see: https://platform.openai.com/docs/api-reference/fine-tunes/retrieve

<details>
  <summary>Code</summary>

```typescript
const fineTune = await openAI.retrieveFineTune({
  parameter: {
    fine_tune_id: fineTuneId,
  },
})

console.log(fineTune)
```

#### Result
```text
{
  object: 'fine-tune',
  id: 'ft-3hdwiNtrDdVToqccSZ8XJ26U',
  hyperparams: {
    n_epochs: 4,
    batch_size: 1,
    prompt_loss_weight: 0.01,
    learning_rate_multiplier: 0.1
  },
  ...
```
</details>

### Cancel Fine-tune
see: https://platform.openai.com/docs/api-reference/fine-tunes/cancel

<details>
  <summary>Code</summary>

```typescript
const fineTune = await openAI.cancelFineTune({
  parameter: {
    fine_tune_id: fineTuneId,
  },
})
```
</details>

### List Fine-tune Events (Streaming)
see: https://platform.openai.com/docs/api-reference/fine-tunes/events

<details>
  <summary>Code</summary>

```typescript
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
```

#### Result (Streaming)
```text
{
  object: 'fine-tune-event',
  level: 'info',
  message: 'Created fine-tune: ft-3hdwiNtrDdVToqccSZ8XJ26U',
  created_at: 1684230378
}
  ...
```
</details>

### Delete Fine-tune Model
see: https://platform.openai.com/docs/api-reference/fine-tunes/delete-model

<details>
  <summary>Code</summary>

```typescript
await openAI.deleteModel({
  parameter: {
    model: fineTuneModel,
  },
})
```
</details>


## Moderations
### Create Moderation
see: https://platform.openai.com/docs/api-reference/moderations/create

<details>
  <summary>Code</summary>

```typescript
const createModeration = await openAI.createModeration({
  requestBody: {
    input: 'I want to kill them.',
    model: 'text-moderation-latest',
  },
})

console.log(createModeration.results[0])
```
#### Result
```text
{
  flagged: true,
  categories: {
    sexual: false,
    hate: false,
    violence: true,
    'self-harm': false,
    'sexual/minors': false,
    'hate/threatening': false,
    'violence/graphic': false
  },
  category_scores: {
    sexual: 9.697637e-7,
    hate: 0.18252534,
    violence: 0.8871539,
    'self-harm': 1.9077322e-9,
    'sexual/minors': 1.3826513e-8,
    'hate/threatening': 0.003294188,
    'violence/graphic': 3.1962415e-8
  }
}
```
</details>

## Tips
### fileToBlobWithFilename (for backend)
This library does not contain code for making BlobWithFilename object
as it will cause conflicts between frontend and backend environment (ex. fail to load 'path' and 'fs' libraries in frontend).

<details>
  <summary>Code</summary>

```typescript
import { BlobWithFilename } from 'openai-api-client'
import path from 'path'
import { readFileSync } from 'fs'
import mime from 'mime-types'

export const fileToBlobWithFilename = (filePath: string): BlobWithFilename => {
  const filename = path.basename(filePath)
  const buffer = readFileSync(filePath)
  const type = mime.lookup(filename)
  if (type === false) {
    throw new Error(`Cannot lookup mime type: ${filename}`)
  }

  return new BlobWithFilename([buffer], type, filename)
}
```
</details>

### Set Timeout
To interrupt API calling when it takes too long.

<details>
  <summary>Code</summary>

```typescript
const abortController = new AbortController()
const timeoutId = setTimeout(() => abortController.abort(), 1000) // too short timeout for testing

const completion = await openAI.createChatCompletion({
  requestBody: {
    model: 'gpt-3.5-turbo-0613',
    messages: [{role: 'user', content: 'Please calculate (1+1)/0'}]
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
</details>

### Customize Throttle Manager
You can write your own logic of handling rate limit.

<details>
  <summary>Code</summary>

```typescript
import {AbstractThrottleManagerService, ResetParams} from 'openai-api-client'

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
  // write parameters
  throttleManagerService: new MyThrottleManagerServiceImpl(CHATGPT_ORGANIZATION_ID)
})
```
</details>

### CommonJS
Example of using this library in CommonJS environment. 

<details>
  <summary>Code</summary>

```javascript
const {openAI} = require('./openAIClient.js')

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
const {OpenAIApi, DefaultThrottleManagerServiceImpl} = require('openai-api-client')

exports.openAI = OpenAIApi({
  organization: CHATGPT_ORGANIZATION_ID,
  apiKey: CHATGPT_API_KEY,
  throttleManagerService: new DefaultThrottleManagerServiceImpl(CHATGPT_ORGANIZATION_ID),
})
```
</details>

## Breaking Changes
### v1.0.0
* VoidThrottleManagerServiceImpl was deprecated. Just omit the `throttleManagerService` parameter of the `OpenAIApi` function or pass `undefined` to the parameter if you don't need throttle management.
* The constructor of `BlobWithFilename` was changed to `(blobPart: BlobPart[], type: string, filename: string)` to pass MIME type of uploading file to API server properly.

## Support
[Issue tracker](https://github.com/TAILBONE-jp/openai-api-client/issues)

## License
[MIT License](https://github.com/TAILBONE-jp/openai-api-client/blob/HEAD/LICENSE)

## Disclaimer
This is an unofficial client library and not endorsed by OpenAI.
