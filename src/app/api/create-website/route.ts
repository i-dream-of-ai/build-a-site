import clientPromise from '@/lib/mongodb'
import { generateCSS } from '@/utils/generate/css'
import { generateHTML } from '@/utils/generate/html'
import { createImages } from '@/utils/generate/images'
import {
  createBucket,
  setBucketPolicy,
  uploadCSSToS3,
  uploadHTMLToS3,
  uploadImagesToS3,
} from '@/utils/s3'
import { deleteBucket } from '@/utils/s3/delete'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

const dbName = process.env.MONGODB_DB

export async function POST(req: NextRequest) {
  const body = await req.json();

  //split out a few of the args for use
  const {
    title,
    userId,
    featureImagePrompt,
    testimonialImagePrompt,
    aboutUsImagePrompt,
  } = body.args

  if (!userId) {
    return NextResponse.json(
      { error: 'Error. User not found.' },
      { status: 400 },
    )
  }

  // Remove any non-alphanumeric characters from the filename
  const bucketName =
    title.replace(/[^a-z0-9]/gi, '').toLowerCase() + '-' + userId

  const client = await clientPromise
  const collection = client.db(dbName).collection('sites')

  try {
    const siteResponse = await collection.findOne({
      bucketName: bucketName,
      userId: new ObjectId(userId),
    })
    if (siteResponse) {
      return NextResponse.json(
        { error: 'Site already exists.' },
        { status: 400 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Error checking if site already exists.' },
      { status: 500 },
    )
  }

  try {
    // Create the bucket
    await createBucket(bucketName)

    // Set the bucket policy to allow public read access
    await setBucketPolicy(bucketName)

    // let images
    // try {
    //   //create the images. this function uses Promise.all
    //   images = await createImages([
    //     {
    //       generator: 'stable',
    //       name: 'featureImage',
    //       prompt: featureImagePrompt,
    //       count: 1,
    //       height: '512',
    //       width: '512',
    //       bucketName,
    //     },
    //     {
    //       generator: 'stable',
    //       name: 'aboutUsImage',
    //       prompt: aboutUsImagePrompt,
    //       count: 1,
    //       height: '576',
    //       width: '1024',
    //       bucketName,
    //     },
    //     {
    //       generator: 'stable',
    //       name: 'testimonialImage',
    //       prompt: testimonialImagePrompt,
    //       count: 1,
    //       height: '720',
    //       width: '720',
    //       bucketName,
    //     },
    //   ])
    // } catch (error) {
    //   // Delete the HTML object
    //   const deleteBucketResponse = await deleteBucket(bucketName)
    //   console.log('deleteBucketResponse', deleteBucketResponse)
    //   if (error instanceof Error) {
    //     return NextResponse.json({ error: error.message }, { status: 500 })
    //   } else {
    //     return NextResponse.json(
    //       { error: 'An unknown error occurred in generate images.' },
    //       { status: 500 },
    //     )
    //   }
    // }

    //TODO: maybe add a check for the images, and add a placeholder if no image?

    //upload the generated image files to the bucket
    //await uploadImagesToS3(images, bucketName)

    //use a placeholder image
    body.args.featureImageURL = `http://placeholder-buildasite.s3.us-west-1.amazonaws.com/dummy_1024x576_ffffff_cccccc_use-the-generate-image-button-on-the-edit-page.svg`
    body.args.aboutUsImageURL = `http://placeholder-buildasite.s3.us-west-1.amazonaws.com/dummy_1024x576_ffffff_cccccc_use-the-generate-image-button-on-the-edit-page.svg`
    body.args.testimonialImageURL = `http://placeholder-buildasite.s3.us-west-1.amazonaws.com/dummy_1024x576_ffffff_cccccc_use-the-generate-image-button-on-the-edit-page.svg`

    //generates the html using the content and templates
    //use false for hasSSL because we are using default http bucket
    const { html } = await generateHTML(body.args, bucketName, false);

    //uses POSTcss to generate the tailwind css
    const css = await generateCSS(html);

    //takes the generated css and uploads it as a file to the bucket
    await uploadCSSToS3(css, bucketName);

    //uploads the generated HTML and uploads it as an index.html file
    const href = await uploadHTMLToS3(html, bucketName)

    //saves the site data to the DB
    const data = await collection.insertOne({
      bucketName: bucketName,
      userId: new ObjectId(userId),
      content: body.args,
      href: href,
    })

    return NextResponse.json(
      { message: 'Website created successfully!', url: 'The website URL is: '+href },
      { status: 200 },
    )
  } catch (error) {
    // Delete the HTML object
    const deleteBucketResponse = await deleteBucket(bucketName)
    console.log('deleteBucketResponse', deleteBucketResponse)

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
