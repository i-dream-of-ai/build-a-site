'use client'

import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider as QCProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient();

export interface AuthContextProps {
  children: React.ReactNode
}

export function NextAuthProvider({ children }: AuthContextProps) {
  return <SessionProvider>{children}</SessionProvider>
}

export function QueryClientProvider({ children }: AuthContextProps) {
  return <QCProvider client={queryClient}>{children}</QCProvider>
}

