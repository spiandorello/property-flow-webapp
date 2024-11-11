import { Err, ErrCause } from './Err'

export class ServiceError extends Err {
  constructor(...args: [string, { code?: string; cause?: ErrCause }?]) {
    super(...args)

    this.name = 'ServiceError'
  }
}
