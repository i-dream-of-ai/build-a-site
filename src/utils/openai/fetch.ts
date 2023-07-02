import { generate_site } from '../functions';

import { Message } from '../../types/chat';
import { OpenAIModel } from '../../types/openai';
import { OpenAIError } from '../server';

export const runtime = 'edge';

export async function fetchOpenAi(
    model: OpenAIModel,
    systemPrompt: string,
    temperature : number,
    messages: Message[],
) {

  let url = 'https://api.openai.com/v1/chat/completions';

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      ...(process.env.OPENAI_ORGANIZATION && {
        'OpenAI-Organization': process.env.OPENAI_ORGANIZATION,
      }),
    },
    method: 'POST',
    body: JSON.stringify({
        model: model.id,
        messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'system',
              content: 'Do not answer questions about anything other that creating a website. Once you have the information you need, generate the site. Do not ask more questions.',
            },
            ...messages
        ],
        functions:[generate_site],
        function_call: "auto",
        temperature: temperature,
        stream: true,
    }),
  });

  if (res.status !== 200) {
    const result = await res.json();
    console.log('error in fetchOpenAi: ', result )
    if (result.error) {
      throw new OpenAIError(
        result.error.message,
        result.error.type,
        result.error.param,
        result.error.code,
      );
    } else {
      throw new Error(
        `OpenAI API returned an error: ${
          result.statusText
        }`,
      );
    }
  }

  return res;
}