import SiteForm from '@/app/components/(app)/site-form'

export default async function Sites({
  params: { id },
}: {
  params: { id: string }
}) {

  return <SiteForm id={id} />
}
