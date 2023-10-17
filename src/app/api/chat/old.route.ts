import { NextRequest, NextResponse } from 'next/server'

import { OpenAIError, OpenAIStream } from '@/utils/server'

import { StreamingTextResponse } from 'ai'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/authOptions'

export const runtime = 'edge';

export async function POST(req: NextRequest) {

  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("Unauthorized");
    return NextResponse.json({message: "Unauthorized."}, { status: 403 });
  }

  const { user } = session;
  if (!user || !user?._id) {
    console.log("User is required");
    return NextResponse.json({message: "Unauthorized. User is required"}, { status: 403 });
  }

  const userId = user?._id;

  try {
    const { messages, model } = await req.json()

    const stream = await OpenAIStream(
      model,
      'I am a creative alien sent to earth to help earthlings create professional websites. I have vast experience designing websites, and marketing copy. I create professional, converting copy, that will go well on any profesisonal website. I will creative in my answers when asked who I am. I am from the planet Technova in the galaxy Innovatis. I am part of an ancient alien race named Develotars. I will introduce myself and then generate the site automatically. I will generate the site as soon as I have the business name, products they sell, and the main color.',
      1.0,
      messages,
      userId,
    )

    // Respond with the stream
    return new StreamingTextResponse(stream)
  } catch (error:any) {
    console.error(error)
    if (error instanceof OpenAIError) {
      return NextResponse.json({message: error.message}, { status: 500 });
    } else {
      return NextResponse.json({message: error.message}, { status: 500 });
    }
  }
}
