import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  PutPublicAccessBlockCommand,
  PutBucketWebsiteCommand,
} from '@aws-sdk/client-s3'
import { deleteBucket } from './delete'
import { extname } from 'path';

const s3Client = new S3Client({ region: process.env.AWS_REGION })

export async function createBucket(bucketName: string) {
  const params = {
    Bucket: bucketName,
  }

  try {
    const data = await s3Client.send(new CreateBucketCommand(params))

    const publicAccessBlockParams = {
      Bucket: bucketName,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        IgnorePublicAcls: false,
        BlockPublicPolicy: false,
        RestrictPublicBuckets: false,
      },
    }

    // Set the public access block configuration
    await s3Client.send(
      new PutPublicAccessBlockCommand(publicAccessBlockParams),
    )

    const websiteParams = {
      Bucket: bucketName,
      WebsiteConfiguration: {
        IndexDocument: {
          Suffix: 'index.html',
        },
      },
    }

    // Enable static website hosting
    await s3Client.send(new PutBucketWebsiteCommand(websiteParams))

    return data
  } catch (err) {
    throw new Error(`Error creating bucket: ${err}`)
  }
}

export async function setBucketPolicy(bucketName: string) {
  const params = {
    Bucket: bucketName,
    Policy: JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${bucketName}/*`,
        },
      ],
    }),
  }

  try {
    const data = await s3Client.send(new PutBucketPolicyCommand(params))
    return data
  } catch (err) {
    throw new Error(`Error setting bucket policy: ${err}`)
  }
}

export async function uploadImagesToS3(
  images: { [key: string]: string[] },
  bucketName: string,
) {
  try {
    for (const [name, imageUrls] of Object.entries(images)) {
      for (let i = 0; i < imageUrls.length; i++) {
        let imageBuffer;
        let contentType;

        // Check if the image is a URL
        if (imageUrls[i].startsWith('http')) {
          // Download the image
          const response = await fetch(imageUrls[i]);
          const arrayBuffer = await response.arrayBuffer();
          imageBuffer = Buffer.from(arrayBuffer);
          contentType = `image/${extname(imageUrls[i]).slice(1)}`;
        } else {
          // Convert the base64 string to a Buffer
          imageBuffer = Buffer.from(imageUrls[i], 'base64');
          contentType = 'image/png';
        }

        const params = {
          Bucket: bucketName,
          Key: `${name}-${i}${extname(imageUrls[i])}`,
          Body: imageBuffer,
          ContentType: contentType,
          CacheControl: 'max-age=3600',
        }
        await s3Client.send(new PutObjectCommand(params))
        // Replace the image URL in the images object with the S3 URL
        images[name][i] = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${name}-${i}${extname(imageUrls[i])}`
      }
    }
    return images
  } catch (err) {
    console.error(`Error: ${err}`)

    // Delete the bucket
    const deleteBucketResponse = await deleteBucket(bucketName)
    console.log('deleteBucketResponse', deleteBucketResponse)

    throw new Error(`Error uploading images: ${err}`)
  }
}

export async function uploadHTMLToS3(html: string, bucketName: string) {
  try {
    const params = {
      Bucket: bucketName,
      Key: `index.html`,
      Body: html,
      ContentType: 'text/html',
      CacheControl: 'max-age=3600',
    }

    // Upload the HTML
    await s3Client.send(new PutObjectCommand(params))

    const websiteUrl = `http://${bucketName}.s3-website.${process.env.AWS_REGION}.amazonaws.com`
    return websiteUrl
  } catch (err) {
    console.error(`Error: ${err}`)

    // Delete the HTML object
    const deleteBucketResponse = await deleteBucket(bucketName)
    console.log('deleteBucketResponse', deleteBucketResponse)

    throw new Error(`Error uploading file: ${err}`)
  }
}
