import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { LoginButton, RegisterButton } from '@/ui/nav-buttons'
import AlienInvasion from '@/ui/alien-invasion'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

export default async function Page() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-medium text-gray-300 mx-auto text-center">
        Build a complete website with Alien Technology (AI) in under a minute!
      </h1>

      <div className="space-y-6 text-white">
        {!session && (
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
      <iframe
        className="mx-auto border rounded-md max-w-md aspect-video"
        width="100%"
        // height="315"
        src="https://www.youtube.com/embed/fxj5PWgWMWU?controls=0"
        title=""
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
        allowFullScreen
      ></iframe>
      {session ? (
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="mx-auto border rounded py-2 flex w-52 items-center justify-center"
          >
            Get Started
          </Link>
        </div>
      ) : (
        ''
      )}

      <AlienInvasion />

    </div>
  )
}
