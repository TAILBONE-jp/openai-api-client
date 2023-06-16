import { AbstractThrottleManagerService } from './AbstractThrottleManagerService.js';
export class VoidThrottleManagerServiceImpl extends AbstractThrottleManagerService {
    params = undefined;
    constructor() {
        super('');
    }
    async wait() {
    }
    async reset(params) {
        this.params = params; // Do nothing
    }
}
