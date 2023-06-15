# OpenAI Client Library
Yet another OpenAI client for both frontend (ex. React) and backend (Node.js) with TypeScript.

### Requirements
* Node.js >= 18.0.0 since this library uses the experimental implementation of fetch
to avoid dependencies with 3rd party libraries as possible.
* Sorry ESM only and no plan for backward compatibility to CommonJS.

### Recommendation
You should setup a proxy at backend code to avoid passing secret API key between frontend and backend.

Do not leak your keys in public!

### Features
* Can use with both frontend and backend codes.
* Sync with the [OpenAPI schema](https://raw.githubusercontent.com/openai/openai-openapi/master/openapi.yaml) provided by OpenAI officially. Current schema version is: 1.3.0
* Streaming completions (`stream=true`) are supported.
* Very basic implementation for throttle management.

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

## Examples
### listFiles

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

### listModels
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

### createChatCompletion
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

### Streaming chat completion
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

## Implement your own throttle manager

```typescript
import {AbstractThrottleManagerService, ResetParams} from "openai-api-client";

class MyThrottleManagerServiceImpl extends AbstractThrottleManagerService {
  constructor(id: string) {
    super(id)
    // write your codes
  }

  async wait(): Promise<void> {
    // write your codes
  }

  async reset(params: ResetParams): Promise<void> {
    // write your codes
  }
}

const openAI = OpenAIApi({
  ... // write parameters
  throttleManagerService: new MyThrottleManagerServiceImpl(CHATGPT_ORGANIZATION_ID)
})
```

## Support
[Issue tracker](https://github.com/TAILBONE-jp/openai-api-client/issues)

## License
[MIT License](https://github.com/TAILBONE-jp/openai-api-client/blob/HEAD/LICENSE)

## Disclaimer
This is unofficial client library and not endorsed by OpenAI.
