import clientPromise from '@/app/lib/mongodb'
import { deleteBucket } from '@/app/lib/s3/delete'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { generateHTML } from '@/app/lib/generate/html'
import { createBucket, setBucketPolicy, uploadCSSToS3, uploadHTMLToS3, uploadImagesToS3 } from '@/app/lib/s3'
import { generateCSS } from '@/app/lib/generate/css'
import { getToken } from 'next-auth/jwt'

const dbName = process.env.MONGODB_DB
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params

  if (!id) {
    console.error('Error. ID not found.')
    return NextResponse.json({ error: 'Error. ID not found.' }, { status: 400 })
  }

  const user = await getToken({req});

  if (!user || !user?._id) {
    console.log("User is required");
    return NextResponse.json({message: "Unauthorized. User is required"}, { status: 403 });
  }

  try {
    const client = await clientPromise
    const collection = client.db(dbName).collection('sites')
    const site = await collection.findOne({
      userId: new ObjectId(user._id),
      _id: new ObjectId(id),
    })

    return NextResponse.json({ site: site }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  
  const user = await getToken({req});

  if (!user || !user?._id) {
    console.log("User is required");
    return NextResponse.json({message: "Unauthorized. User is required"}, { status: 403 });
  }

  const isAdmin = user.role === "admin";

  const { id } = params
  if (!id) {
    return NextResponse.json(
      { error: 'Error. Site ID not found.' },
      { status: 400 },
    )
  }

  try {
    let query = {} as {_id: ObjectId, userId: ObjectId}
    query._id = new ObjectId(id);
    
    // Conditionally add the userId field to the query object if the user is not an admin
    if (!isAdmin) {
      query.userId = new ObjectId(user?._id);
    }

    const client = await clientPromise;
    const collection = client.db(dbName).collection('sites');
    const siteResponse = await collection.findOne(query);

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
    const isDeleted = await deleteBucket(siteResponse.domain || siteResponse.bucketName)

    if (isDeleted.error) {
      return NextResponse.json({ error: isDeleted }, { status: 500 })
    }

    const response = await collection.deleteOne({ _id: siteResponse._id })

    // Respond with the stream
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Delete Site Error: ',error)
    return NextResponse.json({ error: error }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {

  const user = await getToken({req});

  if (!user || !user?._id) {
    console.log("User is required");
    return NextResponse.json({message: "Unauthorized. User is required"}, { status: 403 });
  }

  const { id } = params

  const { bucketName, domain, siteData } = await req.json()

  if (!id) {
    return NextResponse.json({ error: 'Site ID not found.' }, { status: 400 })
  }

  try {

    const client = await clientPromise
    const session = client.startSession()
    session.startTransaction()

    const collection = client.db(dbName).collection('sites')
    const oldSite = await collection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(user?._id),
    }, { session });
    const oldBucketName = oldSite?.bucketName;
    const oldDomain = oldSite?.domain;
    let hasSSL = false;

    if (!oldSite || !oldBucketName) {
      await session.abortTransaction()
      session.endSession()
      return NextResponse.json({ error: 'Site not found.' }, { status: 400 })
    }  

    //create timestamp to break cache
    const timestamp = Date.now();

    //if we have a domain assume we have ssl
    if(domain) {
      hasSSL = true;
      siteData.featureImageURL = `https://${domain}/featureImage-0.png?${timestamp}`
      siteData.aboutUsImageURL = `https://${domain}/aboutUsImage-0.png?${timestamp}`
      siteData.testimonialImageURL = `https://${domain}/testimonialImage-0.png?${timestamp}`
    } else {
      siteData.featureImageURL = `http://${bucketName}.s3-website.${process.env.AWS_REGION}.amazonaws.com/featureImage-0.png?${timestamp}`
      siteData.aboutUsImageURL = `http://${bucketName}.s3-website.${process.env.AWS_REGION}.amazonaws.com/aboutUsImage-0.png?${timestamp}`
      siteData.testimonialImageURL = `http://${bucketName}.s3-website.${process.env.AWS_REGION}.amazonaws.com/testimonialImage-0.png?${timestamp}`
    }

    if(domain && (domain !== oldBucketName && domain !== oldDomain) ){

      try {

        // Create the new bucket
        await createBucket(domain)

        // Set the new bucket policy to allow public read access
        await setBucketPolicy(domain)

        //gather original images and send to the upload function
        const images = {
          'featureImage': [oldSite.content.featureImageURL.split("?")[0]],
          'aboutUsImage': [oldSite.content.aboutUsImageURL.split("?")[0]],
          'testimonialImage': [oldSite.content.testimonialImageURL.split("?")[0]]
        }

        //upload the generated image files to the bucket
        await uploadImagesToS3(images, domain)

        //we are now using a domain with ssl, change the image urls
        siteData.featureImageURL = `https://${domain}/featureImage-0.png?${timestamp}`
        siteData.aboutUsImageURL = `https://${domain}/aboutUsImage-0.png?${timestamp}`
        siteData.testimonialImageURL = `https://${domain}/testimonialImage-0.png?${timestamp}`

        //create html, and mark isSSL true since we have a domain
        const { html } = await generateHTML(siteData, domain, hasSSL)

        //uses POSTcss and tailwindcss to generate the tailwind css
        const css = await generateCSS(html);

        //take the generated css and upload it as a file to the bucket
        await uploadCSSToS3(css, domain);

        //update file in bucket
        const href = await uploadHTMLToS3(html, domain)

        const response = await collection.findOneAndUpdate(
          {
            _id: new ObjectId(id),
            userId: new ObjectId(user?._id),
          },
          { $set: { content: siteData, bucketName: domain, domain: domain, href: href} },
          { returnDocument: 'after', session },
        )
    
        if (!response || !response.value) {
          await session.abortTransaction()
          session.endSession()
          return NextResponse.json({ error: 'Site not updated.' }, { status: 500 })
        }

        //delete the OLD bucket and content
        await deleteBucket(oldBucketName);

        await session.commitTransaction()
        session.endSession()

        // Respond with the stream
        return NextResponse.json(response.value, { status: 200 })

      } catch (error) {
        await session.abortTransaction()
        session.endSession()
        return NextResponse.json({ error: 'Site not updated.' }, { status: 500 })
      }

    } else {

      //create html
      const { html } = await generateHTML(siteData, bucketName, hasSSL)

      //uses POSTcss and tailwindcss to generate the tailwind css
      const css = await generateCSS(html);

      //take the generated css and upload it as a file to the bucket
      await uploadCSSToS3(css, bucketName);

      //update file in bucket
      await uploadHTMLToS3(html, bucketName)

      const response = await collection.findOneAndUpdate(
        {
          _id: new ObjectId(id),
          userId: new ObjectId(user?._id),
        },
        { $set: { content: siteData, bucketName: bucketName } },
        { returnDocument: 'after',session },
      )
  
      if (!response || !response.value) {
        await session.abortTransaction()
        session.endSession()
        return NextResponse.json({ error: 'Site not updated.' }, { status: 500 })
      }
  
      await session.commitTransaction()
      session.endSession()

      // Respond with the stream
      return NextResponse.json(response.value, { status: 200 })
    }


  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
