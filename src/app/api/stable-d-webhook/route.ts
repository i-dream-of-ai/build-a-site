import clientPromise from '@/lib/mongodb'

import { NextRequest, NextResponse } from 'next/server'

import { uploadImagesToS3 } from '@/utils/s3'

const dbName = process.env.MONGODB_DB

export async function POST(req: NextRequest) {
  const { track_id, ...imageData } = await req.json()
  const trackData = JSON.parse(track_id)

  try {
    const client = await clientPromise
    const collection = client.db(dbName).collection('images')
    const doc = await collection.findOneAndUpdate(
      { bucketName: trackData.bucketName, name: trackData.name },
      { $set: imageData },
      {
        upsert: true,
        returnDocument: 'after',
      },
    )
    if (doc.value && doc.value.status === 'success') {
      const images: { [key: string]: string[] } = {}
      images[trackData.name].push(imageData.output[0])

      await uploadImagesToS3(images, trackData.bucketName)

      //collection.deleteOne()

      console.log('webhook doc: ', doc)
      return NextResponse.json(
        { message: 'Image created successfully' },
        { status: 201 },
      )
    }

    console.error('Image webhook error: ', doc)
    return NextResponse.json({ message: 'Image not updated.' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
