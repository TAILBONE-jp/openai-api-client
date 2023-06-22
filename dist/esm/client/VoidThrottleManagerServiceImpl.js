import { AbstractThrottleManagerService, } from './AbstractThrottleManagerService.js';
/**
 * @deprecated since version 0.1.3
 */
export class VoidThrottleManagerServiceImpl extends AbstractThrottleManagerService {
    params = undefined;
    constructor() {
        super('');
    }
    async wait() { }
    async reset(params) {
        this.params = params; // Do nothing
    }
}
