import { generateAboutUsSection } from './about-us'
import { generateContactUsSection } from './contact-us'
import { generateFeaturesSection } from './features'
import { generateFooter } from './footer'
import { generateNavbar } from './navbar'
import { generateHeroSection } from './hero'
import { generateTestimonialSection } from './testimonial'

interface GenerateHtmlProps {
  title: string
  heroTitle: string
  heroContent: string
  navbarItems: Link[]
  featureSectionTagline: string
  featureSectionTitle: string
  featureSectionContent: string
  features: Feature[]
  aboutUsTitle: string
  aboutUsContent: string
  testimonial: Testimonial
  contactUs: string
  copywrite: string
  colors: {
    mainTextColor: string
    secondaryTextColor: string
    mainBackgroundColor: string
    secondaryBackgroundColor: string
    gradientFromColor: string
    gradientToColor: string
  }
  featureImageURL: string
  aboutUsImageURL: string
  testimonialImageURL: string
}

interface Feature {
  title: string
  content: string
}

export interface Link {
  name: string
  href: string
}

interface Testimonial {
  name: string
  content: string
}

export async function generateHTML(props: GenerateHtmlProps) {
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
    contactUs,
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

  const contactUsHTML = generateContactUsSection({ colors })

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
