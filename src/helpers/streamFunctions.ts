import { Message } from '@/old.types/chat'
import { OpenAIModel } from '@/old.types/openai'
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

      messages.push(
        {
          role: 'function',
          name: 'generate_site',
          content: JSON.stringify(content),
        },
        {
          role: 'system',
          content:
            'Site generated successfully. If a URL was not provided for the website, there was an error and you should inform the user of it. Do not make a URL up. If we recieved a URL from AWS, then inform the user they can edit their site content, and generate the image in the edit page. They can find thier site in the list of their sites on the Site page "/sites".',
        },
      )
    } catch (error) {
      console.log('generate_site error: ', error)

      messages.push(
        {
          role: 'function',
          name: 'generate_site',
          content:
            'There was an error, you must inform the user. ' +
            JSON.stringify(error),
        },
        {
          role: 'system',
          content:
            'There was an error, you must inform the user that there was an error, and to try again later.',
        },
      )
    } //end try catch

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
