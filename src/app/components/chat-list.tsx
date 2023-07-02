import { type Message } from 'ai'

import { ChatMessage } from './chat-message'

export interface ChatList {
  messages: Message[],
}

export function ChatList({ messages }: ChatList) {

  if (!messages.length) {
    return null
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => {
        
        return (
          <div key={index}>
            <ChatMessage message={message} />
            {index < messages.length - 1 && (
              <div className='border-b border-gray-500 border-opacity-70 mb-8 py-4'/>
            )}
          </div>
        )
      })}
    </div>
  )
}
