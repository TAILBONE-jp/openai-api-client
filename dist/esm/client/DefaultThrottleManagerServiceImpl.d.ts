import { AbstractThrottleManagerService, type ResetParams } from './AbstractThrottleManagerService.js';
export declare class DefaultThrottleManagerServiceImpl extends AbstractThrottleManagerService {
    debug: boolean;
    constructor(id: string, debug?: boolean);
    private readonly sleep;
    wait(): Promise<void>;
    reset(params: ResetParams): Promise<void>;
}
