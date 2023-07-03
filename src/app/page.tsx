import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { authOptions } from './api/auth/[...nextauth]/route'
import { LoginButton, RegisterButton } from '@/ui/nav-buttons'
import AlienInvasion from "@/ui/alien-invasion"

export default async function Page() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-medium text-gray-300">
        Ready to build a site with AI? LFG!
      </h1>

      <div className="space-y-6 text-white">
        {session ? (
          <div className="space-y-3">
            <p className="mb-2">You have an account!</p>

            <Link
              href="/dashboard"
              className="border rounded py-2 flex w-52 items-center justify-center"
            >
              Get Started!
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between max-w-lg gap-3 mx-auto">
            <div>
              <p className="mb-2">Have an account? </p>
              <LoginButton text="Sign In" />
            </div>

            <div>
              <p className="mb-2">Need an account? </p>
              <RegisterButton />
            </div>
          </div>
        )}
      </div>
      <AlienInvasion />

    </div>
  )
}
