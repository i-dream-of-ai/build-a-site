import { Configuration, OpenAIApi } from 'openai-edge'

export const runtime = 'edge'

export const generate_site = {
  name: 'generate_site',
  description:
    "This function generates quality content and a color palette and then generates a single page website. The AI assistant creates the content, it's not the users job to create the content. The AI will only ask if the user is ready, then generate the site. The AI assistant will not ask for the content itself, since it is the assistants task to create it. The AI assistant doen not need to show the user the content, unless the user asks. The content generated will be inserted into prebuilt website templates for the user, the color palette will be used in the templates by leveraging TailwindCSS. The sections we will provide content for are the hero section, features section, about-us section, testimonials section, contact-us section, and the footer.",
  parameters: {
    type: 'object',
    properties: {
      colors: {
        type: 'object',
        description:
          "The main brand colors of the website. Return an object of TailwindCSS colors. Use professional color pallets for brands. The colors should look great together. The text color and background color should have good contrast so the text is visible, and fully accessible. Only use TailwindCSS colors that exist in the tailwind library. for the gradient colors, use the main background color as the 'from color', and choose a sutiable 'to color' based on the main color. Ask the user what kind of colors they like if they dont tell you. Example { mainTextColor: 'bg-blue-400'} ",
        properties: {
          mainTextColor: { type: 'string' },
          secondaryTextColor: { type: 'string' },
          mainBackgroundColor: { type: 'string' },
          secondaryBackgroundColor: { type: 'string' },
          gradientFromColor: { type: 'string' },
          gradientToColor: { type: 'string' },
        },
        required: [
          'mainTextColor',
          'secondaryTextColor',
          'mainBackgroundColor',
          'secondaryBackgroundColor',
          'gradientFromColor',
          'gradientToColor',
        ],
      },
      title: {
        type: 'string',
        description:
          'The title of the website. This is also the business name, which the user provides.',
      },
      heroTitle: {
        type: 'string',
        description:
          "A short title for the hero section of the website. The hero title should be engaging, and short. Do NOT say something like 'welcome to the business name', please be creative. Generate this based on the information you have about the business. Don't ask the user for this.",
      },
      heroContent: {
        type: 'string',
        description:
          "Content for the hero section of the website. This should be at least 1 full sentence, and 4 sentences max. It should be optimized to the brands ideal customers. Generate this based on the information you have about the business. Don't ask the user for this.",
      },
      heroImagePrompt: {
        type: 'string',
        description:
          'Generate a professional detailed image prompt for the hero section. This detailed image prompt will be used with an AI generator like DALLE-2. This prompt should create a highly detailed image that features a professional looking photo of the product of the business, with great lighting. There should never be a person in this image. This prompt should reflect the business branding, and should attract customers to engage with the brand.',
      },
      features: {
        type: 'array',
        description:
          'Return an array of 3-4 features for the features section of the website. Each object in the array should have a name and content parameter. These features should reflect the best aspects of the business. If you dont know enough about the business to generate these then ask the user.',
        items: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description:
                'The title text for a feature in the feature section of the website.',
            },
            content: {
              type: 'string',
              description:
                'The content of a feature in the feature section of the website. This content should be only 2-3 sentences, and should be written in a way that emphasizes a key feature of the business.',
            },
          },
          required: ['title', 'content'],
        },
      },
      featureSectionTagline: {
        type: 'string',
        description:
          "The tagline of the features section. This is placed about the title of the section. It should be catchy, short, and to the point. Only 2-5 words. Generate this based on the information you have about the business. Don't ask the user for this.",
      },
      featureSectionTitle: {
        type: 'string',
        description:
          "The header title of the features section. It should be short and to the point. Generate this based on the information you have about the business. Don't ask the user for this. It should be short, like 'A better workflow' or 'All-in-one platform'. Make sure it is in line with the business, and mwill make visitors interested in reading about the companies features.",
      },
      featureSectionContent: {
        type: 'string',
        description:
          "A paragraph for the feature section content of the website. It should be professional. Generate this based on the information you have about the business. Don't ask the user for this.",
      },
      aboutUsImagePrompt: {
        type: 'string',
        description:
          'Professional detailed image prompt that will used to generate an image for the about us section. Return a professional image prompt that will be used with an AI generator like DALLE-2. This prompt should reflect the business branding by showing a product of the company, and should attract customers to engage with the brand. There should never be a person in this image. The image generated should be products of the business.',
      },
      aboutUsTitle: {
        type: 'string',
        description:
          "The header title of the about us section. It should be short and to the point. Generate this based on the information you have about the business. Don't ask the user for this. It should be short, like 'About Us'.",
      },
      aboutUsContent: {
        type: 'string',
        description:
          "A paragraph describing the business. It should be professional and describe the best factors of the business. If you don't have enough information, ask the user. Generate this based on the information you have about the business. Don't ask the user for this.",
      },
      testimonial: {
        type: 'object',
        description:
          "A single testimonial about the business. Generate the testimonial based on the information you have about the business. Don't ask the user for this.",
        properties: {
          name: {
            type: 'string',
            description:
              'The name of the person who write the testimonial for the business.',
          },
          content: {
            type: 'string',
            description:
              'The content of the testimonial. This should only be 2-3 sentences long.',
          },
        },
        required: ['name', 'content'],
      },
      testimonialImagePrompt: {
        type: 'string',
        description:
          "Return a professional image prompt that will be used with an AI image generator. The gender of the image should match the testimonial persons gender. Always use the following prompt template for testimonials and only change the gender to match the testimonial gender. Prompt Template: 'realistic close up portrait ((female)) DSLR photography, sharp focus,((cinematic lighting)), f/1.4, ISO 200, 1/160s, 8K, RAW, unedited, symmetrical balance, in-frame'",
      },
      copywrite: {
        type: 'string',
        description: 'The copywrite text for the footer of the website.',
      },
    },
    required: [
      'colors',
      'title',
      'heroTitle',
      'heroContent',
      'heroImagePrompt',
      'featureSectionTagline',
      'featureSectionTitle',
      'featureSectionContent',
      'features',
      'aboutUsImagePrompt',
      'aboutUsTitle',
      'aboutUsContent',
      'testimonialImagePrompt',
      'testimonial',
      'copywrite',
    ],
  },
}

export async function createSite(args) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/create-website`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ args }),
      },
    )

    let data
    try {
      data = await response.json()
    } catch (error) {
      console.error('Error parsing createSite response as JSON:', error)
      throw new Error('Error parsing createSite response as JSON')
    }

    if (!response.ok) {
      const message = `An error has occured in createSite Fetch: ${JSON.stringify(
        data,
      )}`
      console.error(message)
      return message
    }
    return data
  } catch (error) {
    console.log('error in createSite: ', error)
    throw new Error(error)
  }
}

// Process function calls in the queue one at a time
export async function createStableDiffusionImage(args) {
  try {
    const response = await fetch(
      'https://stablediffusionapi.com/api/v3/text2img',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: process.env.STABLE_DIFFUSION_KEY,
          prompt: args.prompt,
          negative_prompt: args.negativePrompt || 'sex, nude, breasts, butt, tits, sexy, naked',
          width: args.width ? args.width : '1024',
          height: args.height ? args.height : '576',
          samples: args.count || 1,
          num_inference_steps: '20',
          seed: null,
          guidance_scale: '7.5',
          safety_checker: 'yes',
          self_attention: 'no',
          webhook: null,
          panorama: 'no',
          enhance_prompt: 'yes',
        }),
      },
    )

    const result = await response.json()

    if (!response.ok) {
      console.error('Response status:', response.status)
      console.error('generate_image error: ', result)
      return result
    }

    return result
  } catch (error) {
    console.error('Error during fetch:', error)
    throw error
  }
}

export async function createDalle2Image(args) {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    })
    const openai = new OpenAIApi(configuration)
    const res = await openai.createImage({
      prompt: args.prompt,
      n: args.count,
      size: args.size,
      response_format: 'b64_json',
    })

    const response = await res.json()

    if (!res.ok) {
      console.error('Error during createImage:', response)
      throw new Error('Error during createImage:', response)
    }

    return response
  } catch (error) {
    console.error('Error during fetch:', error)
    throw new Error(error)
  }
}
