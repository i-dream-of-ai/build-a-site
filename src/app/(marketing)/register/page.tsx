import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import RegisterForm from '@/components/(marketing)/register-form'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

export const dynamic = 'force-dynamic'

export default async function Register() {
  let session
  try {
    session = await getServerSession(authOptions)
  } catch (error) {
    console.error(error)
  }

  if (session) {
    redirect('/dashboard')
  } else {
    return (
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <RegisterForm />
        </div>
      </div>
    )
  }
}
