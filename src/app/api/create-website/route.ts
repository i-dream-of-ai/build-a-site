import clientPromise from '@/app/lib/mongodb'
import { generateCSS } from '@/app/lib/generate/css'
import { generateHTML } from '@/app/lib/generate/html'
import { createImages } from '@/app/lib/generate/images'
import {
  createBucket,
  setBucketPolicy,
  uploadCSSToS3,
  uploadHTMLToS3,
  uploadImagesToS3,
} from '@/app/lib/s3'
import { deleteBucket } from '@/app/lib/s3/delete'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

const dbName = process.env.MONGODB_DB;

export async function POST(req: NextRequest) {

  const body = await req.json();

  //split out a few of the args for use
  const {
    title,
    userId,
    featureImagePrompt,
    testimonialImagePrompt,
    aboutUsImagePrompt,
  } = body;

  if (!userId) {
    console.error('create site error: User not found')
    return NextResponse.json(
      { error: 'Error. User not found.' },
      { status: 400 },
    )
  }

  // Remove any non-alphanumeric characters from the filename
  const bucketName = title.replace(/[^a-z0-9]/gi, '').toLowerCase() + '-' + userId;

  const client = await clientPromise;
  const collection = client.db(dbName).collection('sites');

  try {
    const siteResponse = await collection.findOne({
      bucketName: bucketName,
      userId: new ObjectId(userId),
    })
    if (siteResponse) {
      console.error('create site error: Site already exists')

      return NextResponse.json(
        { error: 'Site already exists.' },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error('create site error: Error checking if site already exists.')

    return NextResponse.json(
      { error: 'Error checking if site already exists.' },
      { status: 500 },
    )
  }

  try {
    // Create the bucket
    await createBucket(bucketName)
  } catch(error){
    console.error('create bucket error:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json(
        { error: 'An unknown error occurred creating the bucket.' },
        { status: 500 },
      )
    }
  }

  try {
    // Set the bucket policy to allow public read access
    await setBucketPolicy(bucketName)
  } catch (error) {
    console.error('set bucket policy error:', error)

    // Delete the HTML object
    const deleteBucketResponse = await deleteBucket(bucketName)
    console.log('deleteBucketResponse', deleteBucketResponse)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json(
        { error: 'An unknown error occurred setting the bucket policy.' },
        { status: 500 },
      )
    }
  }

  let images
  try {
    //create the images. this function uses Promise.all
    images = await createImages([
      {
        name: 'featureImage',
        prompt: featureImagePrompt,
        count: 1,
        height: '512',
        width: '512',
      },
      {
        name: 'aboutUsImage',
        prompt: aboutUsImagePrompt,
        count: 1,
        height: '576',
        width: '1024',
      },
      {
        name: 'testimonialImage',
        prompt: testimonialImagePrompt,
        count: 1,
        height: '720',
        width: '720',
      },
    ])
  } catch (error) {
    console.error('generated image files error:', error)

    // Delete the HTML object
    const deleteBucketResponse = await deleteBucket(bucketName)
    console.log('deleteBucketResponse', deleteBucketResponse)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json(
        { error: 'An unknown error occurred in generate images.' },
        { status: 500 },
      )
    }
  }

    //use a timestamp to always bust cache
    const timestamp = Date.now();

    //check if an image was generated. 
    //We need to do this because the image api sometimes takes awhile and will switch to webhook.
    if(images.featureImage[0]){
      body.featureImageURL = `http://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/featureImage-0?${timestamp}`
    } else {
      body.featureImageURL = `http://placeholder-buildasite.s3.us-west-1.amazonaws.com/dummy_1024x576_ffffff_cccccc_use-the-generate-image-button-on-the-edit-page.svg?${timestamp}`
    }

    if(images.aboutUsImage[0]){
      body.aboutUsImageURL = `http://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/aboutUsImage-0?${timestamp}`
    } else {
      body.aboutUsImageURL = `http://placeholder-buildasite.s3.us-west-1.amazonaws.com/dummy_1024x576_ffffff_cccccc_use-the-generate-image-button-on-the-edit-page.svg`
    }

    if(images.testimonialImage[0]){
      body.testimonialImageURL = `http://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/testimonialImage-0?${timestamp}`
    } else {
      body.testimonialImageURL = `http://placeholder-buildasite.s3.us-west-1.amazonaws.com/dummy_1024x576_ffffff_cccccc_use-the-generate-image-button-on-the-edit-page.svg`
    }
    
  try {
    //upload the generated image files to the bucket
    await uploadImagesToS3(images, bucketName)
  } catch (error) {
    console.error('uploading generated image files error:', error)

    // Delete the HTML object
    const deleteBucketResponse = await deleteBucket(bucketName)
    console.log('deleteBucketResponse', deleteBucketResponse)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json(
        { error: 'An unknown error occurred in uploading images to your bucket.' },
        { status: 500 },
      )
    }
  }
    
  let href
  try {
    //generates the html using the content and templates
    //use false for hasSSL because we are using a default http bucket
    const { html } = await generateHTML(body, bucketName, false);

    //uses POSTcss to generate the tailwind css
    const css = await generateCSS(html);

    //takes the generated css and uploads it as a file to the bucket
    await uploadCSSToS3(css, bucketName);

    //uploads the generated HTML and uploads it as an index.html file
    href = await uploadHTMLToS3(html, bucketName)
  } catch (error) {
    console.error('html or css error:', error)

    // Delete the HTML object
    const deleteBucketResponse = await deleteBucket(bucketName)
    console.error('deleteBucketResponse', deleteBucketResponse)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json(
        { error: 'An unknown error occurred in generating and uplaoding html or css for your site.' },
        { status: 500 },
      )
    }
  }

  try{
    //saves the site data to the DB
    const data = await collection.insertOne({
      bucketName: bucketName,
      userId: new ObjectId(userId),
      content: body,
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
        { error: 'An error occurred while saving your site.' },
        { status: 500 },
      )
    }
  }
}
