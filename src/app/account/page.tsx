import { User } from '@/types/user'
import { AccountForm } from '../components/account-form'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function Account() {
  const session = (await getServerSession(authOptions)) as any

  if (!session) return redirect('/sign-in')

  const user = session.user as User

  return <AccountForm user={user} />
}
