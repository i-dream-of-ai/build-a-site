import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { conversations } from '@/helpers/conversationApi'

interface RequestContext {
  params: {
    id: string
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  try {
    const response = await conversations.getById(id)
    return NextResponse.json(response)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest, ctx: RequestContext) {
  const params = await req.json()
  try {
    const response = await conversations.create(params)
    return NextResponse.json(response)
  } catch (error: any) {
    console.log('error', error.message)

    return NextResponse.json(error.message, { status: 500 })
  }
}

export async function PUT(req: NextRequest, ctx: RequestContext) {
  const params = await req.json()
    try {
      const response = await conversations.update(params)
      return NextResponse.json(response)
    } catch (error: any) {
      console.log('conversation route put error: ', error)
      return NextResponse.json(error.message, { status: 500 })
    }
}