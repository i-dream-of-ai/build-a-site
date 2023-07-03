'use client'

import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

interface LoginButtonProps {
  text: string
}

export const LoginButton = ({ text }: LoginButtonProps) => {
  return (
    <button
      className="border rounded py-2 flex w-52 items-center justify-center"
      onClick={() => signIn()}
    >
      {text}
    </button>
  )
}

export const RegisterButton = () => {
  return (
    <Link
      href="/register"
      className="border rounded py-2 flex w-52 items-center justify-center"
    >
      Register
    </Link>
  )
}

export const LogoutButton = () => {
  return (
    <button style={{ marginRight: 10 }} onClick={() => signOut()}>
      Sign Out
    </button>
  )
}
