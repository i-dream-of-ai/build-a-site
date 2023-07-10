import '@/styles/globals.css'
import { Metadata } from 'next'
import { NextAuthProvider, RQProvider } from './providers'
import NavBar from '@/app/components/navbar'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || ''),
  title: {
    default: 'Build a Site - AI',
    template: '%s | Build a Site - AI',
  },
  description: 'Explore our new AI Site builder.',
  themeColor: '#ffffff',
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Build a Site - AI',
    description: 'Auto Site builder, powered by AI.',
    url: 'https://buildasite.ai',
    siteName: 'Build a Site - AI',
    locale: 'en_US',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="[color-scheme:dark]">
      <body className="bg-gray-1100 overflow-y-scroll bg-[url('/grid.svg')] pb-36">
        <Toaster />
        <NextAuthProvider>
          <RQProvider>
            <NavBar />
            <div className="">
              <div className="mx-auto max-w-4xl space-y-8 px-2 pt-20 lg:py-8 lg:px-8">
                <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
                  <div className="rounded-lg bg-black">
                    <div className="flex gap-x-1 text-sm font-medium p-4">
                      <span className="px-2 text-gray-400">
                        Build a website with AI! ** Please Note: This is a POV,
                        and site may be deleted once we launch our final
                        product! **
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
                  <div className="rounded-lg bg-black p-3.5 lg:p-6">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </RQProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
