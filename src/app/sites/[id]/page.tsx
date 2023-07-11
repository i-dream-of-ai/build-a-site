import SiteForm from '@/app/components/site-form'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Sites({
  params: { id },
}: {
  params: { id: string }
}) {
  const session = await getServerSession();
  if(!session) redirect('/');

  return <SiteForm id={id} />
}
