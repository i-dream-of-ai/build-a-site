import { z } from 'zod';
import { generate_site } from "@/app/config/tools";
import { DynamicStructuredTool } from "langchain/tools";

export async function llmTools(userId) {

  let tools = [
    await createSite(userId)
  ]; 

  return tools;
}

export async function createSite(userId) {
  return new DynamicStructuredTool({
    tags: generate_site.tags,
    name: generate_site.name,
    description: generate_site.description,
    schema: z.object({
      colors: z.object({
        mainTextColor: z.string().describe(generate_site.parameters.properties.colors.properties.mainTextColor.description),
        secondaryTextColor: z.string().describe(generate_site.parameters.properties.colors.properties.secondaryTextColor.description),
        mainBackgroundColor: z.string().describe(generate_site.parameters.properties.colors.properties.mainBackgroundColor.description),
        secondaryBackgroundColor: z.string().describe(generate_site.parameters.properties.colors.properties.secondaryBackgroundColor.description),
        gradientFromColor: z.string().describe(generate_site.parameters.properties.colors.properties.gradientFromColor.description),
        gradientToColor: z.string().describe(generate_site.parameters.properties.colors.properties.gradientToColor.description),
      }).describe(generate_site.parameters.properties.colors.description),
      title: z.string().describe(generate_site.parameters.properties.title.description),
      heroTitle: z.string().describe(generate_site.parameters.properties.heroTitle.description),
      heroContent: z.string().describe(generate_site.parameters.properties.heroContent.description),
      featureImagePrompt: z.string().describe(generate_site.parameters.properties.featureImagePrompt.description),
      features: z.array(
        z.object({
          title: z.string().describe(generate_site.parameters.properties.features.items.properties.title.description),
          content: z.string().describe(generate_site.parameters.properties.features.items.properties.content.description),
        })
      ).describe(generate_site.parameters.properties.features.description),
      featureSectionTagline: z.string().describe(generate_site.parameters.properties.featureSectionTagline.description),
      featureSectionTitle: z.string().describe(generate_site.parameters.properties.featureSectionTitle.description),
      featureSectionContent: z.string().describe(generate_site.parameters.properties.featureSectionContent.description),
      aboutUsImagePrompt: z.string().describe(generate_site.parameters.properties.aboutUsImagePrompt.description),
      aboutUsTitle: z.string().describe(generate_site.parameters.properties.aboutUsTitle.description),
      aboutUsContent: z.string().describe(generate_site.parameters.properties.aboutUsContent.description),
      testimonial: z.object({
        name: z.string().describe(generate_site.parameters.properties.testimonial.properties.name.description),
        content: z.string().describe(generate_site.parameters.properties.testimonial.properties.content.description),
      }).describe(generate_site.parameters.properties.testimonial.description),
      testimonialImagePrompt: z.string().describe(generate_site.parameters.properties.testimonialImagePrompt.description),
      contactUsTitle: z.string().describe(generate_site.parameters.properties.contactUsTitle.description),
      contactUsContent: z.string().describe(generate_site.parameters.properties.contactUsContent.description),
      copywrite: z.string().describe(generate_site.parameters.properties.copywrite.description),
    }),
    func: async ({
      colors,
      title,
      heroTitle,
      heroContent,
      featureImagePrompt,
      features,
      featureSectionTagline,
      featureSectionTitle,
      featureSectionContent,
      aboutUsImagePrompt,
      aboutUsTitle,
      aboutUsContent,
      testimonial,
      testimonialImagePrompt,
      contactUsTitle,
      contactUsContent,
      copywrite,
    }) => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/create-website`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            colors,
            title,
            heroTitle,
            heroContent,
            featureImagePrompt,
            features,
            featureSectionTagline,
            featureSectionTitle,
            featureSectionContent,
            aboutUsImagePrompt,
            aboutUsTitle,
            aboutUsContent,
            testimonial,
            testimonialImagePrompt,
            contactUsTitle,
            contactUsContent,
            copywrite,
            userId
          }),
        });
        if (!res.ok) {
          return "There was an error while generating the site. Inform the user and contact support.";
        }
        const response = await res.json();
        return `The site was successfully generated. Inform the user. data:${response}`;
      } catch (error) {
        console.error(`There was an error while generating the site. Error: ${error.message}`)
        return `There was an error while generating the site. Inform the user. Error: ${error.message}`;
      }
    },
    returnDirect: false, //allows the tool to return the output directly
  });
}

export async function createDalle2Image(args) {
      console.log('args',args);

      try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            prompt: args.prompt,
            n: args.count,
            size: args.size,
            response_format: 'b64_json',
          })
        });

        if (!response.ok) {
          throw new Error(`There was an error while generating a site image. Inform the user. Error: ${response.status}`);
        }

        const data = await response.json();
        return data;

      } catch (error) {
        console.error("There was a problem with the dalle2 image generator:", error.message);
        throw new Error(`There was an error while generating a site image. Inform the user. Error: ${error.message}`);
      }
}