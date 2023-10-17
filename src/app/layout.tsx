import '@/styles/globals.css'
import { Metadata } from 'next'
import { NextAuthProvider, RQProvider } from './providers'
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
    <html lang="en" className="[color-scheme:dark] w-full">
      <body className="bg-gray-1100 overflow-y-scroll bg-[url('/grid.svg')] pb-36 w-full">
        <Toaster />
        <NextAuthProvider>
          <RQProvider>
            <div className="">
              {children}
            </div>
          </RQProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
