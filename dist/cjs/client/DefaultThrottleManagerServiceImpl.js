"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultThrottleManagerServiceImpl = void 0;
const async_lock_1 = __importDefault(require("async-lock"));
const AbstractThrottleManagerService_js_1 = require("./AbstractThrottleManagerService.js");
const timeLimitMap = new Map();
const lock = new async_lock_1.default();
class DefaultThrottleManagerServiceImpl extends AbstractThrottleManagerService_js_1.AbstractThrottleManagerService {
    debug;
    constructor(id, debug) {
        super(id);
        this.debug = debug ?? false;
    }
    sleep = async (msec) => await new Promise((resolve) => setTimeout(resolve, msec));
    async wait() {
        const current = timeLimitMap.get(this.id);
        if (current !== undefined) {
            const waitTime = current - Date.now();
            if (waitTime > 0) {
                if (this.debug) {
                    console.log(`Waiting for ${waitTime} mSecs...`);
                }
                await this.sleep(waitTime);
            }
        }
    }
    async reset(params) {
        if (this.debug) {
            console.log(params);
        }
        if (params.remainingRequests === 0 && params.resetRequests != null) {
            const mSec = params.resetRequests;
            await lock.acquire(this.id, () => {
                const currentValue = timeLimitMap.get(this.id);
                const now = Date.now();
                if (currentValue == null || currentValue < now) {
                    timeLimitMap.set(this.id, mSec + now);
                }
                else {
                    timeLimitMap.set(this.id, mSec + currentValue);
                }
            });
        }
    }
}
exports.DefaultThrottleManagerServiceImpl = DefaultThrottleManagerServiceImpl;
