export interface ResetParams {
  limitRequests: number | null
  limitTokens: number | null
  remainingRequests: number | null
  remainingTokens: number | null
  resetRequests: number | null
  resetTokens: number | null
  url: string
  method: string
}

export abstract class AbstractThrottleManagerService {
  protected constructor (protected id: string) {
    this.id = id
  }

  abstract wait (): Promise<void>

  abstract reset (params: ResetParams): Promise<void>
}
