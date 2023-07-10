import clientPromise from '@/lib/mongodb'
import { createDalle2Image, createStableDiffusionImage } from '../functions'

interface ImagePrompt {
  generator: string
  name: string
  prompt: string
  count: number
  width?: string
  height?: string
  bucketName: string
}

export const runtime = 'edge'

const dbName = process.env.MONGODB_DB

export async function createImages(imagePrompts: ImagePrompt[] = []) {
  const client = await clientPromise
  const collection = client.db(dbName).collection('images')

  const imagePromises = imagePrompts.flatMap(
    ({ generator, prompt, count, width, height, bucketName, name }) => {
      if (generator === 'dalle') {
        return Array.from({ length: count }, () =>
          createDalle2Image({
            prompt,
            count,
            size: width + 'x' + height,
          }),
        )
      } else if (generator === 'stable') {
        return Array.from({ length: count }, () =>
          createStableDiffusionImage({
            prompt,
            count,
            height,
            width,
            track_id: JSON.stringify({
              bucketName: bucketName,
              name: name,
            }),
          }),
        )
      }
    },
  )

  try {
    const fetchResponses = await Promise.all(imagePromises)
    const images: { [key: string]: string[] } = {}
    let currentPromptIndex = 0
    let currentCount = imagePrompts[0].count

    await Promise.all(
      fetchResponses.map(async (fetchResponse, i) => {
        if (i >= currentCount && currentPromptIndex < imagePrompts.length - 1) {
          currentPromptIndex++
          currentCount += imagePrompts[currentPromptIndex].count
        }

        const name = imagePrompts[currentPromptIndex]?.name
        const generator = imagePrompts[currentPromptIndex]?.generator
        if (name) {
          if (!images[name]) {
            images[name] = []
          }
          if (generator === 'dalle') {
            const imageData = fetchResponse.data[0]
            if (imageData && imageData.b64_json) {
              images[name].push(imageData.b64_json)
            } else {
              throw new Error(`Image data is undefined for name ${name}`)
            }
          } else if (generator === 'stable') {
            const imageURL = fetchResponse.output[0]

            if (imageURL) {
              images[name].push(imageURL)
            } else {
              await collection.updateOne(
                {
                  bucketName: imagePrompts[0].bucketName,
                  name: name,
                },
                { $set: { ...fetchResponse } },
                { upsert: true },
              )
              images[name].push('')
              //throw new Error(`Your image is being created by alien artisans of the highest caliber. This may take a minute or two. Once the task is completed, we will beam it into your account. ${name}`)
            }
          }
        } else {
          throw new Error(`Name is undefined at index ${currentPromptIndex}`)
        }
      }),
    )

    return images // return the object of image prompts and URLs
  } catch (error) {
    console.error('Error generating images:', error)
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error(JSON.stringify(error))
    } // re-throw the error so it can be caught and handled elsewhere
  }
}
