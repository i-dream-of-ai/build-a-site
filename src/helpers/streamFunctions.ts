import { Message } from '@/types/chat'
import { OpenAIModel } from '@/types/openai'
import { createSite } from '@/utils/functions'
import { fetchOpenAi } from '@/utils/openai/fetch'

export const runtime = 'edge'

let currentFunctionCall = {
  name: null,
  arguments: '',
}

const resendStream = async (
  model: OpenAIModel,
  systemPrompt: string,
  temperature: number,
  messages: Message[],
  encoder: TextEncoder,
  decoder: TextDecoder,
  controller: ReadableStreamDefaultController,
  streamParser: any,
) => {
  const response = await fetchOpenAi(model, systemPrompt, temperature, messages)

  if (response.status !== 200) {
    const result = await response.json()
    console.log('error in res:', result)
    if (result.error) {
      const queue = encoder.encode(
        JSON.stringify({ type: 'error', content: result.error.message }),
      )
      controller.enqueue(queue)
      controller.error(result)
    } else {
      const queue = encoder.encode(
        JSON.stringify({
          type: 'error',
          content: `OpenAI API returned an error: ${result.statusText}`,
        }),
      )
      controller.enqueue(queue)
      controller.error(result)
    }
  }

  for await (const chunk of response.body as any) {
    streamParser.feed(decoder.decode(chunk))
  }
}

export const getFunction = async (
  json: any,
  encoder: TextEncoder,
  controller: ReadableStreamDefaultController,
) => {
  if (json.choices[0].delta.function_call.name) {
    currentFunctionCall.name = json.choices[0].delta.function_call.name
    const message = encoder.encode(
      JSON.stringify({
        type: 'function_call',
        content: currentFunctionCall.name,
      }),
    )
    controller.enqueue(message)
  }
  if (json.choices[0].delta.function_call.arguments) {
    currentFunctionCall.arguments +=
      json.choices[0].delta.function_call.arguments
  }
}

export const runFunction = async (
  encoder: TextEncoder,
  controller: ReadableStreamDefaultController,
  model: OpenAIModel,
  systemPrompt: string,
  temperature: number,
  messages: Message[],
  streamParser: any,
  userId: string,
) => {
  // Parse the arguments from the string
  const args = JSON.parse(currentFunctionCall.arguments)

  if (currentFunctionCall.name === 'generate_site') {
    try {
      args.userId = userId

      const content = await createSite(args)

      console.log('createSite content: ', content)

      messages.push(
        {
          role: 'function',
          name: 'generate_site',
          content: JSON.stringify(content),
        },
        {
          role: 'system',
          content:
            'Use the content from generate_site in your markdown response. If a URL was not provided for the websote, there was an error and you should inform the user of it. If you recieved a URL then inform the user they can find a list of their sites on the sites page located at "/sites" and link it. Also display a link to the users site.',
        },
      )
    } catch (error) {
      console.log('createSite content error: ', error)

      messages.push(
        {
          role: 'function',
          name: 'generate_site',
          content: JSON.stringify(error),
        },
        {
          role: 'system',
          content: 'There was an error, you must inform the user!',
        },
      )
    }

    // Reset current function call
    currentFunctionCall = {
      name: null,
      arguments: '',
    }

    // Resend stream
    await resendStream(
      model,
      systemPrompt,
      temperature,
      messages,
      encoder,
      new TextDecoder(),
      controller,
      streamParser,
    )
  }
}
