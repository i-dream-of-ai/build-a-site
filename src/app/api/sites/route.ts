import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { Site } from '@/types/site'
import { revalidateTag } from 'next/cache'

const dbName = process.env.MONGODB_DB
export const revalidate = 3

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

  const tag = req.nextUrl.searchParams.get('tag')
  tag && revalidateTag(tag)

  try {
    const client = await clientPromise
    const collection = client.db(dbName).collection('sites')
    const siteResponse = collection.find({
      userId: new ObjectId(user._id),
    })

    const sites = await siteResponse.toArray()

    // Convert each object in the array
    const simpleDataArray = sites.map((data) => ({
      _id: data._id.toString() as string, // convert ObjectId to string
      bucketName: data.bucketName as string,
      userId: data.userId.toString() as string, // convert ObjectId to string
      content: data.content as object,
      href: data.href as string,
    }))

    return NextResponse.json(
      { sites: simpleDataArray as Site[] },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
