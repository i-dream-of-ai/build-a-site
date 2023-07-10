import SiteForm from '@/app/components/site-form'

export default async function Sites({
  params: { id },
}: {
  params: { id: string }
}) {
  return <SiteForm id={id} />
}
