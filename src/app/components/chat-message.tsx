import { Message } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { cn } from '@/lib/utils'
import { CodeBlock } from './ui/codeblock'
import { MemoizedReactMarkdown } from './markdown'
import { ChatMessageActions } from './chat-message-actions'
import { IconAlien, IconUser } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  const [usingFunction, setUsingFunction] = useState<string>('')
  const [currentMessage, setCurrentMessage] = useState<string>('')

  useEffect(() => {
    try {
      const json = JSON.parse(message.content)
      setUsingFunction(json.content)
    } catch (error) {
      setCurrentMessage(
        message.content.replace(
          '{"type":"function_call","content":"generate_site"}',
          '',
        ),
      )
      setUsingFunction('')
    }
  }, [message])

  if (usingFunction) {
    return (
      <div className="px-4 py-2 bg-purple-600 text-white rounded">
        <Image src="/ufo.svg" width="300" height="300" alt="ufo" className='animate-ufo'/>
        <div className='text-white font-bold animate-pulse text-4xl text-center mx-auto -mt-8 mb-4'>Generating Site</div>
      </div>
    )
  }

  return (
    <div
      className={cn('group relative mb-4 flex items-start md:-ml-12')}
      {...props}
    >
      <div
        className={cn(
          'flex h-8 w-8 mt-4 shrink-0 select-none items-center justify-center rounded-md border shadow',
          message.role === 'user'
            ? 'bg-background'
            : 'bg-primary text-primary-foreground',
        )}
      >
        {message.role === 'user' ? (
          <IconUser className="text-indigo-500" />
        ) : (
          <IconAlien className="text-purple-500" />
        )}
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <MemoizedReactMarkdown
          className="prose break-words prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == '▍') {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  )
                }

                children[0] = (children[0] as string).replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className || '')

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              )
            },
          }}
        >
          {currentMessage}
        </MemoizedReactMarkdown>
        <ChatMessageActions message={message} />
      </div>
    </div>
  )
}
