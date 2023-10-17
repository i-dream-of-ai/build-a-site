import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { users } from '@/helpers/userApi'

export async function GET(request: NextRequest) {
    const { id } = await request.json()
    try {
      const response = users.getById(id)
      return NextResponse.json(response)
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
  const params = await request.json()
    try {
      const response = await users.create(params)
      return NextResponse.json(response)
    } catch (error: any) {
      console.log('error', error.message)

      return NextResponse.json(error.message, { status: 500 })
    }
}