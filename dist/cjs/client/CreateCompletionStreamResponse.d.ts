export interface CreateCompletionStreamResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        text?: string;
        index?: number;
        logprobs?: {
            tokens?: string[];
            token_logprobs?: number[];
            top_logprobs?: Array<{}>;
            text_offset?: number[];
        } | null;
        finish_reason?: string;
    }>;
}
