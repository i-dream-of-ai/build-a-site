import { Chat } from '../components/chat'

export const runtime = 'edge'

export default async function Page() {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <div className="border rounded-lg overflow-hidden">
        <Chat />
      </div>
    </div>
  )
}
