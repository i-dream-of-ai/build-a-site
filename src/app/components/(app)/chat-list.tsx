"use client"
import { Message } from '@/app/types/chat';
import { MemoizedReactMarkdown } from './Markdown/MemoizedReactMarkdown';
import { IconLoader2 } from '@tabler/icons-react';

export interface ChatList {
  messages: Message[],
  isLoading: boolean,
  currentTool: string
}

export function ChatList({ messages, isLoading, currentTool }: ChatList) {

  if (!messages.length) {
    return null
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.length ? (
          <div className="prose mt-8 w-full text-white dark:prose-invert prose-p:m-0 flex flex-col">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.role === "assistant" ? "assistant" : "user"
                } relative overflow-scroll mb-8 w-full`}
              >
                {msg.role === "assistant" && isLoading && messages.length - 1 === index ? (
                  <IconLoader2 size={18} className="absolute right-5 top-5 animate-spin" />
                ) : (
                  ""
                )}
                {msg.role === "assistant" && currentTool && messages.length - 1 === index && (
                  <div className="rounded-md bg-yellow-400 px-4 py-2 text-gray-700">
                    {currentTool}
                  </div>
                )}
                <div className={`font-semibold p-6 w-full rounded-3xl max-w-lg ${msg.role === "assistant" ? "float-right bg-indigo-500" : "float-left bg-gray-300 text-gray-800"} `}>
                <MemoizedReactMarkdown
                  className="flex-1"
                  components={{
                 
                    table({ children }) {
                      return (
                        <table className="border-collapse border border-black px-3 py-1 dark:border-white">
                          {children}
                        </table>
                      );
                    },
                    th({ children }) {
                      return (
                        <th className="break-words bg-gray-500 px-3 py-1 text-white dark:border-white">
                          {children}
                        </th>
                      );
                    },
                    td({ children }) {
                      return <td className="break-words px-3 py-1">{children}</td>;
                    },
                  }}
                >
                  {msg.content}
                </MemoizedReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
    </div>
  )
}
