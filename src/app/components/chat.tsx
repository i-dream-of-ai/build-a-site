'use client'

import { useChat, type Message } from 'ai/react'

import { cn } from '@/lib/utils'
import { ChatList } from './chat-list'
import { ChatPanel } from './chat-panel'

import { toast } from 'react-hot-toast'
import { useEffect, useRef, useState } from 'react'
import { ObjectId } from 'mongodb'
import { OpenAIModel, OpenAIModels } from '@/types/openai'
import { useSession } from 'next-auth/react'

import { useRouter, useSearchParams } from 'next/navigation'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

interface Conversation {
  _id: ObjectId | string
  messages: Message[]
  model: OpenAIModel
  userId: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {

  const scrollRef = useRef<HTMLDivElement>(null)

  const router = useRouter()

  const searchParams = useSearchParams()
  const convoId = searchParams.get('id')

  const { data } = useSession()
  const user = data?.session?.user

  const [conversation, setConversation] = useState<Conversation>()
  const [finished, setFinished] = useState<boolean>(false)

  const [businessName, setBusinessName] = useState<string>('')
  const [productType, setProductType] = useState<string>('')
  const [colorType, setColorType] = useState<string>('')

  const {
    messages,
    append,
    reload,
    stop,
    isLoading,
    input,
    setInput,
    setMessages,
  } = useChat({
    initialMessages,
    id,
    body: {
      id: conversation?._id,
      model: conversation?.model || OpenAIModels['gpt-3.5-turbo-0613'],
    },
    onResponse(response) {
      if (response.status !== 200) {
        toast.error(response.statusText)
      }
    },
    onFinish(message) {
      setFinished(true)
    },
  })

  async function initAiMessage(e: any) {
    e.preventDefault()

    append({
      id: conversation?._id.toString() || '',
      content: `Hi, I would like to generate a website. Here is some information about my business. Business Name: ${businessName}, Kinds of products we sell: ${productType}, Color information to use: ${colorType}`,
      role: 'user',
    })
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'instant' })
  }, [messages])

  async function createOrUpdateConversation(messages: Message[]) {
    const response = await fetch('/api/conversation', {
      method: 'PUT',
      body: JSON.stringify({
        id: conversation?._id,
        messages,
        model: OpenAIModels['gpt-3.5-turbo-0613'],
        userId: user?._id,
      }),
    })
    const newConvo = await response.json()
    setFinished(false)

    if (!response.ok) {
      console.error(newConvo)
      toast.error(newConvo.message)
      return
    }
    if (!convoId) {
      router.push(`/dashboard?id=${newConvo._id}`)
    }
    setConversation(newConvo)
  }

  useEffect(() => {
    if (messages.length !== conversation?.messages.length && finished) {
      console.log('Updating...')
      createOrUpdateConversation(messages)
    }
  }, [finished, messages])

  useEffect(() => {
    async function getConversation(id: string) {
      if (!id) return

      const response = await fetch(`/api/conversation?id=${id}`)
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message)
      }
      setMessages(data.messages)
      return data
    }
    if (convoId && !conversation) {
      getConversation(convoId)
    } else if(!convoId && conversation){
      setConversation(undefined)
    }
  }, [convoId, conversation])

  return (
    <>
      <div className={cn('pb-[60px] pt-4', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <div ref={scrollRef} />
          </>
        ) : (
          <div className="mx-auto flex items-center justify-center w-full text-lg italic px-8">
            <form className="w-full mx-auto" onSubmit={initAiMessage}>
              <div className="space-y-12">
                <div className="border-b border-purple-500/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-neutral-300">
                    Get Started
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-neutral-400">
                    We just need some basic information about your business.
                  </p>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium leading-6 text-neutral-300"
                      >
                        What is your business name?
                      </label>
                      <div className="mt-2">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-600">
                          <input
                            type="text"
                            name="title"
                            id="title"
                            autoComplete="title"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className="block flex-1 border-0 bg-transparent p-2 text-neutral-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium leading-6 text-neutral-300"
                      >
                        What kind of products do you sell?
                      </label>
                      <p className="mt-1 text-sm leading-6 text-neutral-500">
                        Example: I sell baby cribs.
                      </p>
                      <div className="mt-2">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-600">
                          <input
                            type="text"
                            name="title"
                            id="title"
                            autoComplete="title"
                            value={productType}
                            onChange={(e) => setProductType(e.target.value)}
                            className="block flex-1 border-0 bg-transparent p-2 text-neutral-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium leading-6 text-neutral-300"
                      >
                        Enter some details about the main color you want to use.
                      </label>
                      <p className="mt-1 text-sm leading-6 text-neutral-500">
                        Example: Use the color blue. Light and soft.
                      </p>
                      <div className="mt-2">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-600">
                          <input
                            type="text"
                            name="title"
                            id="title"
                            autoComplete="title"
                            value={colorType}
                            onChange={(e) => setColorType(e.target.value)}
                            className="block flex-1 border-0 bg-transparent p-2 text-neutral-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="py-2 px-4 rounded-md flex items-center justify-center bg-purple-600 cursor-pointer hover:bg-purple-700 text-white"
              >
                Get Started
              </button>
            </form>
          </div>
        )}
      </div>

      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />
    </>
  )
}
