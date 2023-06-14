import {AbstractThrottleManagerService, ResetParams} from "./AbstractThrottleManagerService.js";

export class VoidThrottleManagerServiceImpl extends AbstractThrottleManagerService {
  params: ResetParams | undefined = undefined
  constructor() {
    super("")
  }

  async wait(): Promise<void> {
  }

  async reset(params: ResetParams): Promise<void> {
    this.params = params // Do nothing
  }
}
