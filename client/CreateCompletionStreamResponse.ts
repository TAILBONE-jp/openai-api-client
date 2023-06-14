export interface CreateCompletionStreamResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    text?: string;
    index?: number;
    logprobs?: {
      tokens?: string[];
      token_logprobs?: number[];
      top_logprobs?: {}[];
      text_offset?: number[];
    } | null;
    finish_reason?: string;
  }[];
}
