interface ContactUsSectionProps {
  colors: {
    mainTextColor: string
    secondaryTextColor: string
    mainBackgroundColor: string
    secondaryBackgroundColor: string
  },
  contactUsTitle: string,
  contactUsContent: string,
  contactUsPhone?: string,
  contactUsEmail?: string,
  contactUsAddress?: string
}

export function generateContactUsSection({ colors, contactUsTitle, contactUsContent, contactUsPhone, contactUsEmail, contactUsAddress }: ContactUsSectionProps) {
  return `
      <section class="w-full bg-white" id="contact-us">
      <div class="relative isolate">
      
        <div class="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
          <div class="mx-auto max-w-xl">
            <div class="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden ${colors.mainBackgroundColor}">
              <svg class="absolute inset-0 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" aria-hidden="true">
                <defs>
                  <pattern id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527" width="200" height="200" x="100%" y="-1" patternUnits="userSpaceOnUse">
                    <path d="M130 200V.5M.5 .5H200" fill="none" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" stroke-width="0" fill="white" />
                <svg x="100%" y="-1" class="overflow-visible fill-gray-50">
                  <path d="M-470.5 0h201v201h-201Z" stroke-width="0" />
                </svg>
                <rect width="100%" height="100%" stroke-width="0" fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
              </svg>
            </div>
            <h2 class="text-3xl font-bold tracking-tight ${colors.mainTextColor}">${contactUsTitle}</h2>
            <p class="mt-6 text-lg leading-8 ${colors.mainTextColor}/80">${contactUsContent}</p>
            <dl class="mt-10 space-y-4 text-base leading-7 ${colors.mainTextColor}">
              <div class="flex gap-x-4 ${contactUsAddress ? '' : 'hidden'}">
                <dt class="flex-none">
                  <span class="sr-only">Address</span>
                  <svg class="h-7 w-6 ${colors.mainTextColor}/60" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                </dt>
                <dd>${contactUsAddress}</dd>
              </div>
              <div class="flex gap-x-4 ${contactUsPhone ? '' : 'hidden'}">
                <dt class="flex-none">
                  <span class="sr-only">Telephone</span>
                  <svg class="h-7 w-6 ${colors.mainTextColor}/60" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </dt>
                <dd><a class="hover:${colors.mainTextColor}/90" href="tel:${contactUsPhone}">${contactUsPhone}</a></dd>
              </div>
              <div class="flex gap-x-4 ${contactUsEmail ? '' : 'hidden'}">
                <dt class="flex-none">
                  <span class="sr-only">Email</span>
                  <svg class="h-7 w-6 ${colors.mainTextColor}/60" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </dt>
                <dd><a class="hover:${colors.mainTextColor}/90" href="mailto:${contactUsEmail}">${contactUsEmail}</a></dd>
              </div>
            </dl>
          </div>
        </div>
        
      </div>
      </section>
    `
}