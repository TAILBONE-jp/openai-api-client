export interface ResetParams {
  limitRequests: number | null // x-ratelimit-limit-requests
  limitTokens: number | null // x-ratelimit-limit-tokens
  remainingRequests: number | null // x-ratelimit-remaining-requests
  remainingTokens: number | null // x-ratelimit-remaining-tokens
  resetRequests: number | null // x-ratelimit-reset-requests
  resetTokens: number | null // x-ratelimit-reset-tokens
  url: string
  method: string
}

export abstract class AbstractThrottleManagerService {
  protected constructor(protected id: string) {
    this.id = id
  }

  abstract wait(): Promise<void>

  abstract reset(params: ResetParams): Promise<void>
}
