'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function RegisterForm() {
  const router = useRouter()

  const [working, isWorking] = useState<boolean>(false)

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')

  async function submit(e: any) {
    e.preventDefault()

    isWorking(true)

    if (!email) {
      toast.error('You must include your email!')
      return
    }
    if (!password) {
      toast.error('You must include your password!')
      return
    }
    if (password !== passwordConfirm) {
      toast.error('Your passwords must match!')
      return
    }

    const response = await fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    })
    const body = await response.json()

    isWorking(false)

    if (!response.ok) {
      toast.error(body)
    }

    router.push('/dashboard')
  }

  return (
    <div>
      <div className="mb-8">
        <Image
          className={`${working && 'animate-pulse'} mx-auto max-w-[150px]`}
          src="/ufo.svg"
          width={200}
          height={200}
          alt="logo"
        />

        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-200">
          Register for a FREE account
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-300">
          Already a member?{' '}
          <Link
            href="/login"
            className="font-semibold text-indigo-400 hover:text-indigo-500"
          >
            Log in
          </Link>
        </p>
      </div>

      <form onSubmit={submit} method="POST" className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-purple-500"
          >
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-purple-300 placeholder:text-purple-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 bg-gray-800"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-purple-500"
          >
            Password
          </label>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-purple-300 placeholder:text-purple-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 bg-gray-800"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium leading-6 text-purple-500"
          >
            Confirm Password
          </label>
          <div className="mt-2">
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-purple-300 placeholder:text-purple-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 bg-gray-800"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={working}
            className={`flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:animate-pulse`}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  )
}
