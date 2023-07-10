import {
  S3Client,
  DeleteBucketCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3'

const s3Client = new S3Client({ region: process.env.AWS_REGION })

let response = {
  actions: {
    files: false,
    bucket: false,
  },
  success: false,
  error: '',
}

export async function deleteBucket(bucketName: string) {
  if (!bucketName) {
    response.error = `Could not find a bucket name! ${bucketName}}`
    return response
  }

  try {
    // List all objects in the bucket
    const listObjectsResponse = await s3Client.send(
      new ListObjectsV2Command({ Bucket: bucketName }),
    )

    // Delete all objects
    if (listObjectsResponse.Contents) {
      for (const object of listObjectsResponse.Contents) {
        if (object.Key) {
          try {
            await s3Client.send(
              new DeleteObjectCommand({ Bucket: bucketName, Key: object.Key }),
            )
            //console.log(`Object ${object.Key} deleted from bucket ${bucketName}.`);
          } catch (deleteObjectErr) {
            console.error(
              `Could not delete object ${object.Key} from bucket ${bucketName}: ${deleteObjectErr}`,
            )
          }
        }
      }
    }
    response.actions.files = true
  } catch (listObjectsErr) {
    console.error(
      `Could not list objects in bucket ${bucketName}: ${listObjectsErr}`,
    )
  }

  try {
    // Delete the bucket
    await s3Client.send(new DeleteBucketCommand({ Bucket: bucketName }))
    response.actions.bucket = true
    response.success = true
  } catch (deleteBucketErr) {
    console.error(`Could not delete bucket ${bucketName}: ${deleteBucketErr}`)
    response.actions.bucket = false
    response.error = `Could not delete bucket ${bucketName}: ${JSON.stringify(
      deleteBucketErr,
    )}`
  }

  return response
}
