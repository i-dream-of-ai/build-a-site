interface AboutUsSectionProps {
  title: string
  paragraph: string
  aboutUsImageURL: string
  colors: {
    mainTextColor: string
    secondaryTextColor: string
    mainBackgroundColor: string
    secondaryBackgroundColor: string
  }
}

export function generateAboutUsSection({
  title,
  paragraph,
  colors,
  aboutUsImageURL,
}: AboutUsSectionProps): string {
  return `
    <div class="relative ${colors.mainBackgroundColor}" id="about-us">
      <div class="relative h-80 overflow-hidden ${colors.secondaryBackgroundColor} md:absolute md:left-0 md:h-full md:w-1/3 lg:w-1/2">
        <img class="h-full w-full object-cover bg-blend-saturation" src="${aboutUsImageURL}" alt="">
        <svg viewBox="0 0 926 676" aria-hidden="true" class="absolute -bottom-24 left-24 w-[57.875rem] transform-gpu blur-[118px]">
          <path fill="url(#60c3c621-93e0-4a09-a0e6-4c228a0116d8)" fill-opacity=".4" d="m254.325 516.708-90.89 158.331L0 436.427l254.325 80.281 163.691-285.15c1.048 131.759 36.144 345.144 168.149 144.613C751.171 125.508 707.17-93.823 826.603 41.15c95.546 107.978 104.766 294.048 97.432 373.585L685.481 297.694l16.974 360.474-448.13-141.46Z" />
          <defs>
            <linearGradient id="60c3c621-93e0-4a09-a0e6-4c228a0116d8" x1="926.392" x2="-109.635" y1=".176" y2="321.024" gradientUnits="userSpaceOnUse">
              <stop stop-color="#776FFF" />
              <stop offset="1" stop-color="#FF4694" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div class="relative mx-auto max-w-7xl py-24 sm:py-32 lg:px-8 lg:py-40">
        <div class="pl-6 pr-6 md:ml-auto md:w-2/3 md:pl-16 lg:w-1/2 lg:pl-24 lg:pr-0 xl:pl-32">
          <p class="mt-2 text-3xl font-bold tracking-tight ${colors.mainTextColor} sm:text-4xl">${title}</p>
          <p class="mt-6 text-base leading-7 ${colors.mainTextColor}">${paragraph}</p>
        </div>
      </div>
    </div>
    `
}
