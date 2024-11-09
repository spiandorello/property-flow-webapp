export class Err extends Error {
  constructor(message, options) {
    super(message ?? 'Unspecified exception.', options)

    this.name = 'Err'
    this.code = options?.code ?? 'unknown'
    this.cause = options?.cause || {}

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Err)
    }
  }
}
