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
* Sync with the OpenAPI schema provided by OpenAI officially.
* Streaming completions (`stream=true`) are supported.
* Very basic implementation for throttle management.

## Installation
```bash
npm install openai-client
```

## Setup for frontend

```typescript
import {OpenAIApi, VoidThrottleManagerServiceImpl} from "openai-client";

export const openAI = OpenAIApi({
  baseUrl: "/api/openai", // URL of a proxy implemented at backend
  throttleManagerService: new VoidThrottleManagerServiceImpl() // Do not care about rate limit
})
```

## Setup for backend

```typescript
import {OpenAIApi, DefaultThrottleManagerServiceImpl} from "openai-client";

export const openAI = OpenAIApi({
  apiKey: CHATGPT_API_KEY,
  organization: CHATGPT_ORGANIZATION_ID,
  throttleManagerService: new DefaultThrottleManagerServiceImpl(CHATGPT_ORGANIZATION_ID)
})
```

## Examples
### List files
```typescript
import {openAI} from "openAiClient.ts"; // see the setup codes above

const files = await openAI.listFiles()
```

### Streaming chat completion
```typescript
import {
  CreateChatCompletionStreamResponse,
  Params$createChatCompletion,
  RequestInitWithCallbacks,
} from "openai-client";
import {openAI} from "openAiClient.ts"; // see the setup codes above

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
  // you need to type cast the 'json' variable with CreateChatCompletionStreamResponse
  onMessage: (json: any) => { ... },
  // Callback function when streaming ends.
  onClose: () => { ... }
})
```

## Implement your own throttle manager

```typescript
import {AbstractThrottleManagerService, ResetParams} from "openai-client";

class DefaultThrottleManagerServiceImpl extends AbstractThrottleManagerService {
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
```
