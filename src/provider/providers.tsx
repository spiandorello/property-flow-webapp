'use client'

import { useEffect } from 'react'

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { onAuthChange } from '@/services/auth/auth'
import { useAuthStore } from '@/store/auth/auth'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (isServer) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()
  const { credentials, setCredentials } = useAuthStore()

  useEffect(() => {
    ;(async () =>
      await onAuthChange(credentials, ({ accessToken, refreshToken }) => {
        setCredentials({ accessToken, refreshToken })

        fetch('/api/auth/setCookies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken, refreshToken }),
        })
      }))()
  }, [JSON.stringify(credentials), setCredentials])

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
