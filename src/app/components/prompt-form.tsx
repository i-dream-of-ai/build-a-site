import * as React from 'react'
import Link from 'next/link'
import { UseChatHelpers } from 'ai/react'

import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { cn } from '@/lib/utils'
import { IconPlus, IconSend, IconSpiral } from '@tabler/icons-react'

export interface PromptProps
  extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => Promise<void>
  isLoading: boolean
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading
}: PromptProps) {

  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [])


  React.useEffect(() => {
    if (inputRef.current) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      inputRef.current.style.height = "0px";
      const scrollHeight = inputRef.current.scrollHeight;
      inputRef.current.style.height = scrollHeight + "px";
    }
  }, [inputRef, input]);

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        if (!input?.trim()) {
          return
        }
        setInput('')
        await onSubmit(input)
      }}
      ref={formRef}
    >
      <div className="relative flex items-start max-h-60 w-full grow overflow-hidden bg-background sm:rounded-md sm:border">

        <Link
          href="/"
          className={cn(
            'w-16 h-[66px] rounded-full bg-background flex items-center justify-center'
          )}
        >
          <IconPlus />
          <span className="sr-only">New Chat</span>
        </Link>

        <textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input || ''}
          onChange={e => setInput(e.target.value)}
          placeholder="Send a message."
          spellCheck={false}
          className="min-h-[55px] h-[64px] w-full bg-transparent px-4 py-[1.3rem] focus-within:outline-none"
        />

        <div className="flex items-center justify-center w-16">
          <button
            className='bg-purple-600 flex items-center justify-center w-14 h-[66px] cursor-pointer'
            type="submit"
            disabled={isLoading || input === ''}
          >
            {isLoading ? <IconSpiral className='animate-spin'/> : <IconSend />}
            
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </div>
    </form>
  )
}