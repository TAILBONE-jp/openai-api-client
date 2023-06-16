import { type Schemas } from '../generated/apiClient.js';
export interface CreateChatCompletionStreamResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        index?: number;
        delta?: Schemas.ChatCompletionResponseMessage;
        finish_reason?: string;
    }>;
}
