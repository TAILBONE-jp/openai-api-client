import { AbstractThrottleManagerService, type ResetParams } from './AbstractThrottleManagerService.js';
/**
 * @deprecated since version 0.1.3
 */
export declare class VoidThrottleManagerServiceImpl extends AbstractThrottleManagerService {
    params: ResetParams | undefined;
    constructor();
    wait(): Promise<void>;
    reset(params: ResetParams): Promise<void>;
}
