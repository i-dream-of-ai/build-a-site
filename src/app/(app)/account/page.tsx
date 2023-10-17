import { User } from '@/old.types/user'
import { AccountForm } from '../../components/(app)/account-form'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

export default async function Account() {

  const session = (await getServerSession(authOptions)) as any
  if (!session) return redirect('/sign-in')

  const user = session.user as User

  return <AccountForm user={user} />
}
