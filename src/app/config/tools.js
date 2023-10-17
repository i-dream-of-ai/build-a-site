export const generate_site = {
    tags: ["generate_site"],
    name: 'generate_site',
    description:
      "This function first generates quality content and a color palette and then generates a website. The AI assistant creates the content, it's not the users job to create or provide the website content. The AI will only ask if the user is ready, then generate the site. The AI assistant will not ask for the content itself, since it is the assistants task to create it. The AI assistant doen not need to show the user the content, unless the user asks. The content generated will be inserted into prebuilt website templates for the user, the color palette will be used in the templates by leveraging TailwindCSS. The sections we will provide content for are the hero section, features section, about-us section, testimonials section, contact-us section, and the footer. We have success when we get back a URL containing amazonaws.com. On success we inform the user they can edit and view thier website on the Sites page, located at /sites. Do not link any other URLs.",
    parameters: {
      type: 'object',
      properties: {
        colors: {
          type: 'object',
          description:
            "The main brand colors of the website. Return an object of TailwindCSS colors. Use professional color pallets for brands. The colors should look great together. The text color and background color should have good contrast so the text is visible, and fully accessible. Only use TailwindCSS colors that exist in the tailwind library. for the gradient colors, use the main background color as the 'from color', and choose a sutiable 'to color' based on the main color. Ask the user what kind of colors they like if they dont tell you. Example { mainTextColor: 'bg-blue-400'}. IMPORTANT: ALWAYS USE HIGH CONTRAST IN THE MAIN AND SECONDARY COLORS TEXT AND BACKGROUNDS! The main text will be over the main background colors, and the secondary text will be over the secondary background. So always make sure they contrast well for good accessibility.",
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
        featureImagePrompt: {
          type: 'string',
          description:
            "Return a professional image prompt that will be used with an AI image generator. Always use the following prompt template and only change the product to match the product of the business. Never include people in the prompt. Prompt Template: 'realistic and detailed photo of a ((product)), DSLR photography, sharp focus, cinematic lighting, f/1.4, ISO 200, 1/160s, 8K, RAW, unedited, symmetrical balance, in-frame'",
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
            "Return a professional image prompt that will be used with an AI image generator. Always use the following prompt template and only change the product to match the product of the business. Never include people in the prompt. Prompt Template: 'realistic and detailed photo of a ((product)), DSLR photography, sharp focus, cinematic lighting, f/1.4, ISO 200, 1/160s, 8K, RAW, unedited, symmetrical balance, in-frame'",
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
                'The name of the person who write the testimonial for the business. Never use Jane Doe or John Doe or Jane Smith or John Smith. Be creative with the name, and do not use common names.',
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
            "Return a professional image prompt that will be used with an AI image generator. The gender of the image should match the testimonial persons gender. Always use the following prompt template for testimonials and only change the gender to match the testimonial gender. Prompt Template: 'realistic and detailed close up portrait ((female)), DSLR photography, sharp focus,((cinematic lighting)), f/1.4, ISO 200, 1/160s, 8K, RAW, unedited, symmetrical balance, in-frame'",
        },
        contactUsTitle: {
          type: 'string',
          description:
            "The header title of the contact us section. It should be a short and only 2 or 3 words. Don't ask the user for this. It should be short. Example: 'Contact Us'.",
        },
        contactUsContent: {
          type: 'string',
          description:
            "A simple call to action paragraph for the contact us section. It should be professional and to the point. Generate this based on the information you have about the business. Don't ask the user for this.",
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
        'featureImagePrompt',
        'featureSectionTagline',
        'featureSectionTitle',
        'featureSectionContent',
        'features',
        'aboutUsImagePrompt',
        'aboutUsTitle',
        'aboutUsContent',
        'contactUsTitle',
        'contactUsContent',
        'testimonialImagePrompt',
        'testimonial',
        'copywrite',
      ],
    },
  }