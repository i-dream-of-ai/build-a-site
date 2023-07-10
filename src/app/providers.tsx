'use client'

import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

export interface AuthContextProps {
  children: React.ReactNode
}

export function NextAuthProvider({ children }: AuthContextProps) {
  return <SessionProvider>{children}</SessionProvider>
}

export function RQProvider({ children }: AuthContextProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
