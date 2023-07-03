import { createDalle2Image } from '../functions'

interface ImagePrompt {
  name: string
  prompt: string
  count: number
  size: string
}

export const runtime = 'edge'

export async function createImages(imagePrompts: ImagePrompt[] = []) {
  const imagePromises = imagePrompts.flatMap(({ prompt, count, size }) => {
    return Array.from({ length: count }, () =>
      createDalle2Image({
        imagePrompt: prompt,
        count: 1,
        size: size,
      }),
    )
  })

  try {
    const fetchResponses = await Promise.all(imagePromises)
    const images: { [key: string]: string[] } = {}
    let currentPromptIndex = 0
    let currentCount = imagePrompts[0].count

    fetchResponses.forEach((fetchResponse, i) => {
      if (i >= currentCount && currentPromptIndex < imagePrompts.length - 1) {
        currentPromptIndex++
        currentCount += imagePrompts[currentPromptIndex].count
      }

      const name = imagePrompts[currentPromptIndex]?.name
      if (name) {
        if (!images[name]) {
          images[name] = []
        }
        const imageData = fetchResponse.data[0]
        if (imageData && imageData.b64_json) {
          images[name].push(imageData.b64_json)
        } else {
          throw new Error(`Image data is undefined for name ${name}`)
        }
      } else {
        throw new Error(`Name is undefined at index ${currentPromptIndex}`)
      }
    })

    //console.log('images', images);
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
