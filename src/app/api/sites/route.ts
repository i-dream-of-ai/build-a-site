import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { sites } from '@/helpers/siteApi'

export async function GET(req: NextRequest) {
  const token = await getToken({ req })
  if (!token) {
    console.error('Error. Session not found.')
    return NextResponse.json(
      { error: 'Error. Session not found.' },
      { status: 400 },
    )
  }

  const user = token.user as any
  if (!user) {
    console.error('Error. User not found.')
    return NextResponse.json(
      { error: 'Error. User not found.' },
      { status: 400 },
    )
  }

  try {
    const siteArray = await sites.getAll()
    return NextResponse.json({ sites: siteArray }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}