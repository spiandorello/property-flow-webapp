import { Err } from './Err'

export class ServiceError extends Err {
  constructor(...args) {
    super(...args)

    this.name = 'ServiceError'
  }
}
