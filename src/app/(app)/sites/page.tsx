import { getServerSession } from 'next-auth'
import { SiteList } from '@/app/components/(app)/site-list'
import { redirect } from 'next/navigation';

export default async function Sites() {
  const session = await getServerSession();
  if(!session) redirect('/');

  return <SiteList />
}
