'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function SigninForm() {
  const router = useRouter()

  const [working, isWorking] = useState<boolean>(false)

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [showModal, setShowModal] = useState<boolean>(false);

  function toggleModal() {
    setShowModal(!showModal);
    if(showModal){
      const email = document.getElementById('email').value;
      saveToken(email).then(r => toast.success('A password verify link has been sent to your email.'));
    }
  }

  async function saveToken(email: string) {
    try {
      const response = await fetch('/api/setToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to save token');
      }

      const data = await response.json();
      if(data){

      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

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

    const status = await signIn('credentials', {
      email: email,
      password: password,
    })
    isWorking(false)

    if (status?.error) {
      toast.error(status.error)
    }
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
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-300">
          Not a member?{' '}
          <Link
            href="/register"
            className="font-semibold text-indigo-400 hover:text-indigo-500"
          >
            Register Here
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

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-purple-600"
            />
            <label
                htmlFor="remember-me"
                className="ml-3 block text-sm leading-6 text-purple-400"
            >
              Remember me
            </label>
          </div>

          <div
              className="ml-3 block text-sm leading-6 text-purple-400"
              onClick={toggleModal}
          >
            Forgot password?
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
      {showModal && (
          <div className="bg-black fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-greydark p-6 rounded shadow-lg w-96">
              <div className="mb-8 mx-auto text-center">
                <Image
                    className={`${working && 'animate-pulse'} mx-auto max-w-[150px]`}
                    src="/ufo.svg"
                    width={200}
                    height={200}
                    alt="logo"
                />
                <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-200">
                  Password Reset
                </h2>
              </div>

              <form onSubmit={submit} method="POST" className="space-y-6 text-center">
                <div>
                  <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-purple-500"
                  >
                    Your Registered Email address
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
                        className="text-center block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-purple-300 placeholder:text-purple-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 bg-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <button
                      type="submit"
                      disabled={working}
                      onClick={toggleModal}
                      className={`flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:animate-pulse`}
                  >
                    Reset Password
                  </button>
                </div>
              </form>
              <br/>
              <br/>
              <button onClick={toggleModal} className="flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:animate-pulse">Cancel</button>
            </div>
          </div>
      )}
    </div>
  )
}
