'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {toast} from "react-hot-toast";

export default function ResetForm() {

  const router = useRouter()

  const [working, isWorking] = useState<boolean>(false)
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get('email');
  const token = urlParams.get('token');
  const [password, setPassword] = useState<string>('')
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')

  async function submit(e: any) {
    e.preventDefault()
    isWorking(true)

    if (password !== passwordConfirm) {
      toast.success('Passwords do not match!');
      return;
    }

    const requestBody = {
      email: email,
      token: token,
      newpassword: password
    };

    try {
      const response = await fetch('/api/updatePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.success(data.message);
        await router.push(data.redirectUrl);  // Redirect using the URL from the response
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('There was an error updating the password:', error);
      toast.error('There was an error. Please try again.');
    }

  }

  return (
      <div>
        <div className="mb-8 mx-auto text-center">
          <Image
              className={`${working && 'animate-pulse'} mx-auto max-w-[150px]`}
              src="/ufo.svg"
              width={200}
              height={200}
              alt="logo"
          />

          <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-200">
            Reset your password
          </h2>

        </div>

        <form onSubmit={submit} method="POST" className="space-y-6 text-center">
          <div>
            <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-purple-500"
            >
              New Password
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
                  className="text-center block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-purple-300 placeholder:text-purple-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 bg-gray-800"
              />
            </div>
          </div>

          <div>
            <label
                htmlFor="passwordconfirm"
                className="block text-sm font-medium leading-6 text-purple-500"
            >
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                  id="passwordconfirm"
                  name="passwordconfirm"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)} // Changed to setPasswordConfirm
                  className="text-center block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-purple-300 placeholder:text-purple-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 bg-gray-800"
              />
            </div>
          </div>
          <br/>
          <br/>
          <div>
            <button
                type="submit"

                className={`flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:animate-pulse`}
            >
              Reset Password
            </button>
          </div>
        </form>

      </div>
  )
}
