import clientPromise from '@/lib/mongodb'
import { deleteBucket } from '@/utils/s3/delete'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const dbName = process.env.MONGODB_DB

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const token = await getToken({ req })
  if (!token) {
    return NextResponse.json(
      { error: 'Error. Session not found.' },
      { status: 400 },
    )
  }

  const user = token.user as any
  if (!user) {
    return NextResponse.json(
      { error: 'Error. User not found.' },
      { status: 400 },
    )
  }

  const { id } = params
  if (!id) {
    return NextResponse.json(
      { error: 'Error. Site ID not found.' },
      { status: 400 },
    )
  }

  try {
    const client = await clientPromise
    const collection = client.db(dbName).collection('sites')
    const siteResponse = await collection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(user?._id),
    })

    if (!siteResponse) {
      return NextResponse.json({ error: 'Site not found.' }, { status: 401 })
    }

    if (!siteResponse.bucketName) {
      return NextResponse.json(
        { error: 'Site name not found.' },
        { status: 401 },
      )
    }

    //delete index file and bucket
    const isDeleted = await deleteBucket(siteResponse.bucketName)

    if (!isDeleted.success) {
      return NextResponse.json({ error: isDeleted }, { status: 500 })
    }

    const response = await collection.deleteOne({ _id: siteResponse._id })

    // Respond with the stream
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
