import clientPromise from '@/lib/mongodb'
import { uploadImagesToS3 } from '@/utils/s3'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { createImages } from '@/utils/generate/images'

const dbName = process.env.MONGODB_DB

export async function POST(req: NextRequest) {

    const token: any = await getToken({ req })

    if (!token || !token.user) {
        return NextResponse.json(
        { error: 'Error. Session not found.' },
        { status: 400 },
        )
    }

    const userId = token.user._id

    const { generator, prompt, field, siteId, width, height } = await req.json()
    
    const client = await clientPromise
    const collection = client.db(dbName).collection('sites')
  
    let site
    try {
      site = await collection.findOne({
        _id: new ObjectId(siteId),
        userId: new ObjectId(userId),
      })
      if (!site) {
        return NextResponse.json(
          { error: 'Site does not exist.' },
          { status: 400 },
        )
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Error checking if site exists.' },
        { status: 500 },
      )
    }
  
    try {
  
      let images
      try {

        //create the images. this function uses Promise.all
        images = await createImages([{ 
          generator: generator ,
          name: field, 
          prompt: prompt, 
          count: 1, 
          width: width, 
          height: height 
        }])
      } catch (error) {

        if (error instanceof Error) {
          return NextResponse.json({ error: error.message }, { status: 500 })
        } else {
          return NextResponse.json(
            { error: 'An unknown error occurred in generate images.' },
            { status: 500 },
          )
        }
      }
  
      await uploadImagesToS3(images, site.bucketName)
  
      return NextResponse.json(
        { message: 'Images created successfully', images: images },
        { status: 200 },
      )
    } catch (error) {
      //return the error so the AI can see it
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      } else {
        return NextResponse.json(
          { error: 'An unknown error occurred' },
          { status: 500 },
        )
      }
    }
  }