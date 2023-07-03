import { RenderingPageSkeleton } from '@/ui/rendering-page-skeleton'

export default function Loading() {
  return (
    <div className="space-y-4 text-vercel-pink">
      <h2 className="text-lg font-bold">Loading...</h2>

      <RenderingPageSkeleton />
    </div>
  )
}
