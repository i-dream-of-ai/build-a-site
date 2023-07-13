interface Feature {
  title: string
  content: string
}

interface FeaturesSectionProps {
  featureSectionTagline: string
  featureSectionTitle: string
  featureSectionContent: string
  featureImageURL: string
  features: Feature[]
  colors: {
    mainTextColor: string
    secondaryTextColor: string
    mainBackgroundColor: string
    secondaryBackgroundColor: string
  }
}

export function generateFeaturesSection({
  featureImageURL,
  featureSectionTagline,
  featureSectionTitle,
  featureSectionContent,
  features,
  colors,
}: FeaturesSectionProps): string {
  const featureHTML = features
    .map(
      (feature) => `
      <div class="relative pl-9">
        <dt class="inline font-semibold text-gray-900">
          ${feature.title}
        </dt>
        <dd class="inline">${feature.content}</dd>
      </div>
    `,
    )
    .join('')

  return `
    <section class="overflow-hidden bg-white py-24 sm:py-32" id="features">
      <div class="mx-auto max-w-6xl md:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
          <div class="px-6 lg:px-0 lg:pr-4 lg:pt-4">
            <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
              <h2 class="text-base font-semibold leading-7 text-indigo-600">${featureSectionTitle}</h2>
              <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                ${featureSectionTagline}
              </p>
              <p class="mt-6 text-lg leading-8 text-gray-600">${featureSectionContent}</p>
              <dl class="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                ${featureHTML}
              </dl>
            </div>
          </div>
          <div class="sm:px-6 lg:px-0">
            <div class="relative isolate overflow-hidden ${colors.mainBackgroundColor} px-6 pt-8 sm:mx-auto sm:max-w-2xl sm:rounded-3xl sm:pl-16 sm:pr-0 sm:pt-16 lg:mx-0 lg:max-w-none">
              <div class="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-30deg] ${colors.secondaryBackgroundColor} opacity-50 ring-1 ring-inset ring-white" aria-hidden="true"></div>
              <div class="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
                <img src="${featureImageURL}" alt="Product screenshot" width="512" height="512" class="-mb-12 w-[500px] h-[500px] max-w-none rounded-tl-xl bg-gray-800 ring-1 ring-white/10 object-cover">
              </div>
              <div class="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 sm:rounded-3xl" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    `
}
