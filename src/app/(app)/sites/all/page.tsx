import { SiteList } from '@/app/components/(app)/site-list'
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/lib/session';

export default async function AllSites() {
  const user = await getCurrentUser();
  if(!user || user.role !== "admin") redirect('/');

  return <SiteList type="all"/>
}