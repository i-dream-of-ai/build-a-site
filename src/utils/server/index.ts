import { getFunction, runFunction } from '@/helpers/streamFunctions'
import { Message } from '../../old.types/chat'
import { OpenAIModel } from '../../old.types/openai'
import { fetchOpenAi } from '../openai/fetch'

import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from 'eventsource-parser'

export class OpenAIError extends Error {
  type: string
  param: string
  code: string

  constructor(message: string, type: string, param: string, code: string) {
    super(message)
    this.name = 'OpenAIError'
    this.type = type
    this.param = param
    this.code = code
  }
}

export const runtime = 'edge'

export const OpenAIStream = async (
  model: OpenAIModel,
  systemPrompt: string,
  temperature: number,
  messages: Message[],
  userId: string,
) => {
  const res = await fetchOpenAi(model, systemPrompt, temperature, messages)

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  let streamParser: any
  let functionParser: any

  const stream = new ReadableStream({
    async start(controller: ReadableStreamDefaultController) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data
          if (!data) {
            return
          }
          if (data === '[DONE]') {
            return
          }
          try {
            const json = JSON.parse(data)
            if (json.choices[0].finish_reason === 'length') {
              const queue = encoder.encode(
                JSON.stringify({
                  type: 'error',
                  content:
                    'Sorry, the chat has exceded the maximum length allowed.',
                }),
              )
              controller.enqueue(queue)
              controller.close()
              return
            }
            if (json.choices[0].finish_reason != null) {
              controller.close()
              return
            }
            const text = json.choices[0].delta.content
            const queue = encoder.encode(text)
            controller.enqueue(queue)
          } catch (e) {
            controller.error(e)
          }
        }
      }

      const onParseFunction = async (
        event: ParsedEvent | ReconnectInterval,
      ) => {
        if (event.type === 'event') {
          const data = event.data
          if (data === '[DONE]') return

          try {
            const json = JSON.parse(data)

            if (json.choices[0].finish_reason === 'length') {
              const queue = encoder.encode(
                JSON.stringify({
                  type: 'error',
                  content:
                    'Sorry, the chat has exceded the maximum length allowed.',
                }),
              )
              controller.enqueue(queue)
              controller.close()
              return
            }

            if (json.choices[0].finish_reason != null) {
              try {
                await runFunction(
                  encoder,
                  controller,
                  model,
                  systemPrompt,
                  temperature,
                  messages,
                  streamParser,
                  userId,
                )
              } catch (error) {
                console.error(`Error at runFunction: ${error}`)
                controller.error(error)
              }
              return
            }
            await getFunction(json, encoder, controller)
          } catch (e) {
            console.error(`Error at onParseFunction: ${e}`)
            controller.error(e)
          }
        }
      }

      if (!streamParser) {
        streamParser = createParser(onParse)
      }

      if (!functionParser) {
        functionParser = createParser(onParseFunction)
      }

      for await (const chunk of res.body as any) {
        const content = decoder.decode(chunk)

        //if its a function call, gather everything we need from the stream
        if (content.includes('function_call')) {
          functionParser.feed(content)
        } else {
          streamParser.feed(content)
        }
      }
    },
  })

  return stream
}
