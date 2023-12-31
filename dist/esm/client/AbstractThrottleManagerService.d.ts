export interface ResetParams {
    limitRequests: number | null;
    limitTokens: number | null;
    remainingRequests: number | null;
    remainingTokens: number | null;
    resetRequests: number | null;
    resetTokens: number | null;
    url: string;
    method: string;
}
export declare abstract class AbstractThrottleManagerService {
    protected id: string;
    protected constructor(id: string);
    abstract wait(): Promise<void>;
    abstract reset(params: ResetParams): Promise<void>;
}
