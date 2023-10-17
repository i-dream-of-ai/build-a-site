export interface SiteContent {
  navbarItems?: [],
  colors: {
    mainTextColor: string
    secondaryTextColor: string
    mainBackgroundColor: string
    secondaryBackgroundColor: string
    gradientFromColor: string
    gradientToColor: string
  }
  title: string
  heroTitle: string
  heroContent: string
  featureImagePrompt: string
  features: [{ title: string; content: string }]
  featureSectionTagline: string
  featureSectionTitle: string
  featureSectionContent: string
  aboutUsImagePrompt: string
  aboutUsTitle: string
  aboutUsContent: string
  testimonial: { name: string; content: string }
  testimonialImagePrompt: string
  userId: string
  featureImageURL: string
  aboutUsImageURL: string
  testimonialImageURL: string
  contactUsTitle: string
  contactUsContent: string
  contactUsPhone?: string
  contactUsEmail?: string
  contactUsAddress?: string
  copywrite: string
  metaDescription?: string
  metaAuthor?: string
}

export interface Site {
  _id: string
  bucketName: string
  userId: string
  content: SiteContent
  href: string
  domain?: string
}

export interface Link {
  href: string
  name: string
}
