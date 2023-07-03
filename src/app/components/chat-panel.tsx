import { type UseChatHelpers } from 'ai/react'

import { PromptForm } from './prompt-form'
import { ButtonScrollToBottom } from './button-scroll-to-bottom'
import { IconHandStop, IconRefresh } from '@tabler/icons-react'

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | 'append'
    | 'isLoading'
    | 'reload'
    | 'messages'
    | 'stop'
    | 'input'
    | 'setInput'
  > {
  id?: string
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages
}: ChatPanelProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-10 items-center justify-center">
          {isLoading ? (
            <button
              onClick={() => stop()}
              className="bg-background"
            >
              <IconHandStop className="mr-2" />
              Stop generating
            </button>
          ) : (
            messages?.length > 0 && (
              <button
                onClick={() => reload()}
                className="bg-background flex gap-1"
              >
                <IconRefresh className="mr-2" />
                Regenerate response
              </button>
            )
          )}
        </div>
        {messages && messages.length ? (
          <div className="space-y-4 bg-background px-4 py-2 shadow-lg rounded-xl sm:border md:py-4 mb-4 bg-black">
            <PromptForm
              onSubmit={async value => {
                await append({
                  id,
                  content: value,
                  role: 'user'
                })
              }}
              input={input}
              setInput={setInput}
              isLoading={isLoading}
            />
          </div>
        ) :""}
        
      </div>
    </div>
  )
}
