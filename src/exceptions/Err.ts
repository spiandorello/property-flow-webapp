export type ErrCause = {
  code?: string
  cause?: string
}

export class Err extends Error {
  code: string
  cause: ErrCause

  constructor(
    message: string,
    options: { code?: string; cause?: ErrCause } = {},
  ) {
    super(message ?? 'Unspecified exception.', options)

    this.name = 'Err'
    this.code = options?.code ?? 'unknown'
    this.cause = options?.cause || {}

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Err)
    }
  }
}
