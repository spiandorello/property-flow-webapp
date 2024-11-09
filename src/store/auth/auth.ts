import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Credentials = {
  accessToken: string | null
  refreshToken: string | null
}

type AuthState = {
  credentials: Credentials
  setCredentials: (credentials: Credentials) => void
  clearCredentials: () => void
}

export const AUTH_INITIAL_STATE: Omit<
  AuthState,
  'setCredentials' | 'clearCredentials'
> = {
  credentials: {
    accessToken: null,
    refreshToken: null,
  },
}
export const AUTH_STORE_NAME = 'auth'
export const name = AUTH_STORE_NAME

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      ...AUTH_INITIAL_STATE,
      setCredentials: (credentials: Credentials) => set({ credentials }),
      clearCredentials: () => set({ ...AUTH_INITIAL_STATE }),
    }),
    {
      name,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
