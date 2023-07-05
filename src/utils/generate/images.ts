import { createDalle2Image, createStableDiffusionImage } from '../functions'

interface ImagePrompt {
  generator: string
  name: string
  prompt: string
  count: number
  width?: string,
  height?: string
}

export const runtime = 'edge'

export async function createImages(imagePrompts: ImagePrompt[] = []) {
  const imagePromises = imagePrompts.flatMap(({ generator, prompt, count, width = '1024', height = '576'}) => {
    if(generator === 'dalle'){
      return Array.from({ length: count }, () =>
        createDalle2Image({
          prompt: prompt,
          count: 1,
          size: width+'x'+height,
        }),
      )
    } else if(generator === 'stable'){
      return Array.from({ length: count }, () =>
        createStableDiffusionImage({
          prompt: prompt,
          count: 1,
          height: height,
          width: width
        }),
      )
    }
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
      const generator = imagePrompts[currentPromptIndex]?.generator
      if (name) {
        if (!images[name]) {
          images[name] = []
        }
        if(generator === 'dalle'){
          const imageData = fetchResponse.data[0]
          if (imageData && imageData.b64_json) {
            images[name].push(imageData.b64_json)
          } else {
            throw new Error(`Image data is undefined for name ${name}`)
          }
        } else if(generator === 'stable'){
          const imageURL = fetchResponse.output[0]
          if (imageURL) {
            images[name].push(imageURL)
          } else {
            throw new Error(`Image data is undefined for name ${name}`)
          }
        }
        
      } else {
        throw new Error(`Name is undefined at index ${currentPromptIndex}`)
      }
    })

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
