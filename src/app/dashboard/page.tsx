import { Chat } from "../components/chat";

export const runtime = 'edge'

export default async function Page() {

  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">AI Chat</h1>

      <div className='border rounded-lg overflow-hidden'>
        <Chat />
      </div>

    </div>
  );
}
