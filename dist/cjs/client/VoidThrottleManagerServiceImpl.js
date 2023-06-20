"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoidThrottleManagerServiceImpl = void 0;
const AbstractThrottleManagerService_js_1 = require("./AbstractThrottleManagerService.js");
class VoidThrottleManagerServiceImpl extends AbstractThrottleManagerService_js_1.AbstractThrottleManagerService {
    params = undefined;
    constructor() {
        super('');
    }
    async wait() { }
    async reset(params) {
        this.params = params; // Do nothing
    }
}
exports.VoidThrottleManagerServiceImpl = VoidThrottleManagerServiceImpl;
