import clientPromise from '@/app/lib/mongodb'

import { NextRequest, NextResponse } from 'next/server'

import { uploadHTMLToS3, uploadImagesToS3 } from '@/app/lib/s3'
import { generateHTML } from '@/app/lib/generate/html'

const dbName = process.env.MONGODB_DB

export async function POST(req: NextRequest) {
  const { track_id, ...imageData } = await req.json()
  const trackData = JSON.parse(track_id)

  try {
    const client = await clientPromise
    const imagesCollection = client.db(dbName).collection('images');;

    const imageDoc = await imagesCollection.findOneAndUpdate(
      { bucketName: trackData.bucketName, name: trackData.name },
      { $set: imageData },
      {
        upsert: true,
        returnDocument: 'after',
      },
    )
    if (imageDoc && imageDoc.value && imageDoc.value.status === 'success') {

      const sitesCollection = client.db(dbName).collection('sites');;
      const site = await sitesCollection.findOne({bucketName: trackData.bucketName})

      if(!site) return NextResponse.json({ error:"Site not found." }, { status: 500 });

      const siteData = site.content;

      const timestamp = Date.now();

      let hasSSL = false
      //if we have a domain assume we have ssl
      if(site.domain) {
        hasSSL = true
        siteData[trackData.name+'URL'] = `https://${site.domain}/${trackData.name}-0.png?${timestamp}`
      } else {
        siteData[trackData.name+'URL'] = `http://${site.bucketName}.s3-website.${process.env.AWS_REGION}.amazonaws.com/${trackData.name}-0.png?${timestamp}`
      }

      const res = await sitesCollection.updateOne({bucketName: trackData.bucketName},{
        $set: {content: siteData}
      })

      const images: { [key: string]: string[] } = {};

      images[trackData.name].push(imageData.output[0])

      await uploadImagesToS3(images, trackData.bucketName)

      //create html, and mark isSSL true since we have a domain
      const { html } = await generateHTML(siteData, site.domain || site.bucketName, hasSSL)

      //update file in bucket
      await uploadHTMLToS3(html, site.domain || site.bucketName)

      imagesCollection.deleteOne({_id: imageDoc.value._id})

      return NextResponse.json(
        { message: 'Image updated successfully' },
        { status: 201 },
      )
    }

    console.error('Image webhook error: ', imageDoc)
    return NextResponse.json({ message: 'Image not updated.' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
