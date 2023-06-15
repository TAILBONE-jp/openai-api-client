import { AbstractThrottleManagerService, ResetParams } from "./AbstractThrottleManagerService.js";
export declare class DefaultThrottleManagerServiceImpl extends AbstractThrottleManagerService {
    debug: boolean;
    constructor(id: string, debug?: boolean);
    private sleep;
    wait(): Promise<void>;
    reset(params: ResetParams): Promise<void>;
}
