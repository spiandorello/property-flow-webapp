export const AUTH_EXCEPTION_UNKNOWN = 'auth/unknown'
export const AUTH_EXCEPTION_INVALID_CREDENTIALS = 'auth/invalid-credential'

type AuthExceptionMessages = {
  [key: string]: string
}

export const AUTH_EXCEPTION_MESSAGES: AuthExceptionMessages = {
  [AUTH_EXCEPTION_UNKNOWN]:
    'Ocorreu um erro inesperado. Por favor, tente novamente.',
  [AUTH_EXCEPTION_INVALID_CREDENTIALS]:
    'Email ou senha inválidos. Por favor, tente novamente.',
}
