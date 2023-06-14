import AsyncLock from "async-lock";
import {AbstractThrottleManagerService, ResetParams} from "./AbstractThrottleManagerService.js";

const timeLimitMap = new Map<string, number>();
const lock = new AsyncLock();

export class DefaultThrottleManagerServiceImpl extends AbstractThrottleManagerService {
  debug: boolean

  constructor(id: string, debug?: boolean) {
    super(id)
    this.debug = debug || false
  }

  private sleep = (msec: number) =>
    new Promise(resolve => setTimeout(resolve, msec));

  async wait(): Promise<void> {
    const current = timeLimitMap.get(this.id);
    if (current) {
      const waitTime = current - Date.now();
      if (waitTime > 0) {
        if(this.debug){
          console.log(`Waiting for ${waitTime} mSecs...`)
        }
        await this.sleep(waitTime);
      }
    }
  }

  async reset(params: ResetParams): Promise<void> {
    if(this.debug){
      console.log(params)
    }

    if (params.remainingRequests === 0 && params.resetRequests) {
      const mSec = params.resetRequests

      await lock.acquire(this.id, () => {
        const currentValue = timeLimitMap.get(this.id);
        const now = Date.now();

        if (!currentValue || currentValue < now) {
          timeLimitMap.set(this.id, mSec + now);
        } else {
          timeLimitMap.set(this.id, mSec + currentValue);
        }
      });
    }
  }
}
