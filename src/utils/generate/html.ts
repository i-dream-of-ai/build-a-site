import { generateAboutUsSection } from './about-us'
import { generateContactUsSection } from './contact-us'
import { generateFeaturesSection } from './features'
import { generateFooter } from './footer'
import { generateNavbar } from './navbar'
import { generateHeroSection } from './hero'
import { generateTestimonialSection } from './testimonial'
import {SiteContent} from '@/types/site' 

export async function generateHTML(props: SiteContent) {
  
  const {
    colors,
    title,
    navbarItems = [],
    heroTitle,
    heroContent,
    featureSectionTagline,
    featureSectionTitle,
    featureSectionContent,
    features = [],
    aboutUsTitle,
    aboutUsContent,
    testimonial,
    contactUsTitle,
    contactUsContent,
    contactUsPhone = '',
    contactUsEmail = '',
    contactUsAddress = '',
    copywrite,
    featureImageURL,
    aboutUsImageURL,
    testimonialImageURL,
  } = props

  //const navbarHTML = generateNavbar({title, navbarItems, colors});

  const heroHTML = generateHeroSection({
    title,
    heroTitle,
    heroContent,
    colors,
  })

  const featuresHTML = generateFeaturesSection({
    featureSectionTagline,
    featureSectionTitle,
    featureSectionContent,
    featureImageURL,
    features,
    colors,
  })

  const aboutUsHTML = generateAboutUsSection({
    title: aboutUsTitle,
    paragraph: aboutUsContent,
    colors,
    aboutUsImageURL,
  })

  const testimonialsHTML = generateTestimonialSection({
    testimonialImageURL,
    testimonial,
    colors,
  })

  const contactUsHTML = generateContactUsSection({ 
    colors,
    contactUsTitle,
    contactUsContent,
    contactUsPhone,
    contactUsEmail,
    contactUsAddress
  })

  const footerHTML = generateFooter({ copywrite, colors })

  const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio"></script>

        </head>
        <body>
          ${heroHTML}
          ${featuresHTML}
          ${aboutUsHTML}
          ${testimonialsHTML}
          ${contactUsHTML}
          ${footerHTML}
        </body>
      </html>
    `

  return { html }
}
