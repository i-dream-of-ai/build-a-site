import { createDalle2Image } from "@/utils/functions"

interface ImagePrompt {
  name: string
  prompt: string
  count: number
  width?: string
  height?: string
}

export async function createImages(imagePrompts: ImagePrompt[] = []) {

  try {

    const imagePromises = imagePrompts.flatMap(
      ({ prompt, count, width, height }) => {
        return Array.from({ length: count }, () =>
          createDalle2Image({
            prompt,
            count,
            size: '512x512',
          }),
        )
      },
    )

    const fetchResponses = await Promise.all(imagePromises)
    const images: { [key: string]: string[] } = {}
    let currentPromptIndex = 0
    let currentCount = imagePrompts[0].count;

    await Promise.all(
      fetchResponses.map(async (fetchResponse, i) => {
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
      }),
    )

    return images; // return the object of image prompts and URLs
  } catch (error) {
    console.error('Error generating images:', error)
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error(JSON.stringify(error))
    }
  }
}
