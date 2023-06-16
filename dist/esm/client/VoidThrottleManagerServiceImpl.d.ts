import { AbstractThrottleManagerService, type ResetParams } from './AbstractThrottleManagerService.js';
export declare class VoidThrottleManagerServiceImpl extends AbstractThrottleManagerService {
    params: ResetParams | undefined;
    constructor();
    wait(): Promise<void>;
    reset(params: ResetParams): Promise<void>;
}
