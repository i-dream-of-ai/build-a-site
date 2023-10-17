import clientPromise from '@/app/lib/mongodb'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { OpenAIModelID, OpenAIModels } from '@/old.types/openai'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/authOptions'

const dbName = process.env.MONGODB_DB
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params

  if (!id) {
    console.error('Error. ID not found.')
    return NextResponse.json({ message: 'Error. ID not found.' }, { status: 400 })
  }

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

  try {
    const client = await clientPromise
    const collection = client.db(dbName).collection('users')
    const user = await collection.findOne({
      _id: new ObjectId(id),
    })
    if (!user) {
      return NextResponse.json({ message: 'No User found.' }, { status: 401 })
    }

    user.model = user.model ? user.model : OpenAIModels[OpenAIModelID.GPT_3_5]
    delete user.password

    return NextResponse.json(user, { status: 200 })
  } catch (error:any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

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
    const collection = client.db(dbName).collection('users')
    const siteResponse = await collection.findOne({
      _id: new ObjectId(id),
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

    const response = await collection.deleteOne({ _id: siteResponse._id })

    // Respond with the stream
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params

  const { email, model } = await req.json()

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

  if (!id) {
    return NextResponse.json({ error: 'Site ID not found.' }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const collection = client.db(dbName).collection('users')
    const response = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { email, model } },
      { returnDocument: 'after' },
    )

    if (!response || !response.value) {
      return NextResponse.json({ error: 'User not updated.' }, { status: 500 })
    }

    // Respond with the stream
    return NextResponse.json(response.value, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
