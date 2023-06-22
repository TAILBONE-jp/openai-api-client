import {
  AbstractThrottleManagerService,
  type ResetParams,
} from './AbstractThrottleManagerService.js'

/**
 * @deprecated since version 0.1.3
 */
export class VoidThrottleManagerServiceImpl extends AbstractThrottleManagerService {
  params: ResetParams | undefined = undefined

  constructor() {
    super('')
  }

  async wait(): Promise<void> {}

  async reset(params: ResetParams): Promise<void> {
    this.params = params // Do nothing
  }
}
