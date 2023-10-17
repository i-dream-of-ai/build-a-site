'use client'

import { cn } from '@/lib/utils'
import { ChatList } from './chat-list'

import { toast } from 'react-hot-toast'
import { useEffect, useRef, useState } from 'react'
import { ObjectId } from 'mongodb'
import { OpenAIModel } from '@/old.types/openai'
import { useSession } from 'next-auth/react'

import { useRouter, useSearchParams } from 'next/navigation'
import { IconAugmentedReality, IconLoader2 } from '@tabler/icons-react'

import { Message } from "@/app/types/chat";

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

  const { data, status } = useSession()
  const user = data?.user

  const [conversation, setConversation] = useState<Conversation>()
  const [finished, setFinished] = useState<boolean>(false)

  const [businessName, setBusinessName] = useState<string>('')
  const [productType, setProductType] = useState<string>('')
  const [colorType, setColorType] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [currentTool, setCurrentTool] = useState("");

  async function submitForm(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    setIsLoading(true);

    setMessages((prevMessages) => [...prevMessages, { role: "user", content: input }]);
    setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: "" }]);

    const prompt = conversation ? input : `Hi, please generate a website for me. Here is some information about my business. Business Name: ${businessName}, Kinds of products we sell: ${productType}, Color information to use: ${colorType}`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          messages: messages,
          conversationUUID: conversation?._id,
          test: true
        }),
      });

      if (!res.ok) {
        const {message} = await res.json();
        console.error("Error:", message);
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "error", content: "Error: " + message },
        ]);
        setIsLoading(false);
        return;
      }

      if (!res.body) {
        console.error("Response body is null");
        setIsLoading(false);
        return;
      }

      if (res.body.locked) {
        console.error("Stream is locked");
        setIsLoading(false);
        return;
      }

      setInput("");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let currentMessage = "";

      while (true) {
        try {
          const { done, value } = await reader.read();

          if (done) {
            setIsLoading(false);
            break;
          }

          buffer += decoder.decode(value, { stream: true }); 

          let endOfTokenIndex = buffer.indexOf("\n");

          while (endOfTokenIndex !== -1) {
            const token = buffer.slice(0, endOfTokenIndex);

            buffer = buffer.slice(endOfTokenIndex + 1);

            try {
              const resObj = JSON.parse(token);

              if (resObj.event === "start") {
                // if (!chatUUID || chatUUID !== resObj.content) {
                //   setChatUUID(resObj.content);
                // }
                if (resObj.type === "tool") {
                  if (resObj.tags[0] === "save-customer-information") {
                    setCurrentTool("Updating your contact info...");
                  } else if (resObj.tags[0] === "Gmail-SendEmail") {
                    setCurrentTool("Sending you an email...");
                  }
                }
              }

              if (resObj.event === "done" && resObj.type === "tool") {
                setCurrentTool("");
              }

              if (resObj.event === "error") {
                setMessages((prevMessages) => {
                  if (!prevMessages.length) {
                    return [
                      { role: "assistant", content: "There was an error. Please try again." },
                    ];
                  }

                  if (prevMessages[prevMessages.length - 1].role === "assistant") {
                    const updatedMessages = [...prevMessages];
                    updatedMessages[updatedMessages.length - 1].content += resObj.content;
                    return updatedMessages;
                  } else {
                    return [
                      ...prevMessages,
                      { role: "assistant", content: "There was an error. Please try again." },
                    ];
                  }
                });
              }

              if (resObj.event === "token") {
                currentMessage += resObj.content;
                setMessages((prevMessages) => {
                  const updatedMessages = [...prevMessages];
                  const lastMessageIndex = updatedMessages.length - 1;
                  const lastMessage = updatedMessages[lastMessageIndex];
                  if (lastMessage.role === "assistant") {
                    lastMessage.content = currentMessage;
                  } 
                  return updatedMessages;
                });
              }

            } catch (error) {
              console.error("ERROR: nonJSON chunk", error);
            }

            endOfTokenIndex = buffer.indexOf("\n"); // Check for the next newline character
          }
        } catch (error) {
          console.error("Error reading from stream:", error);
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      setMessages([...messages, { role: "error", content: "Network error. Please try again." }]);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'instant' })
  }, [messages])

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
    } else if (!convoId && conversation) {
      setConversation(undefined)
    }
  }, [convoId, conversation])

  //fail safe for no user in session
  if (!user && status !== 'loading') {
    return null
  }

  return (
    <>
      <div className={cn('pb-[60px] pt-4', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} isLoading={isLoading} currentTool={currentTool} />
            <div ref={scrollRef} />

            {/* Input field for prompt*/}
            <form className="flex w-full flex-col gap-8 p-3" onSubmit={submitForm}>
                <div className="flex flex-col">
                  <textarea
                    rows={4}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    autoComplete="off"
                    placeholder="Enter your message here."
                    className="w-full rounded-md border-0 border-slate-6 p-3 text-gray-600 shadow"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    className="primary-btn disabled:animate-pulse py-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        Generating <IconLoader2 size={18} className="animate-spin" />
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>
              </form>
          </>
        ) : (
          <div className="mx-auto flex items-center justify-center w-full text-lg italic px-8">
            <form className="w-full mx-auto" onSubmit={submitForm}>
              <div className="space-y-12">
                <div className="border-b border-purple-500/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-neutral-300">
                    Get Started
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-neutral-400">
                    We just need some basic information about your business. Once your site has been generated, you can edit the content and generate the images using the sites edit form.
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
                            required
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
                            required
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
                            required
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
                disabled={!businessName || !productType || !colorType || isLoading}
                className='text-sm md:text-base w-full mt-6 h-11 px-4 rounded-md flex items-center justify-center bg-purple-600 cursor-pointer hover:bg-purple-700 text-white gap-1 hover:animate-none disabled:opacity-50'
              >
                <IconAugmentedReality className="hover:animate-ping" /> 
                Start Mysterious AI Generator
              </button>
            </form>
          </div>
        )}
      </div>
      <div className={`${isLoading ? "w-full relative":"hidden"}`}>
          <div className='animate-ufo animate-pulse h-5 mx-auto bg-gradient-to-r from-blue-900 via-purple-800 to-purple-600' />
      </div>

       
    </>
  )
}
