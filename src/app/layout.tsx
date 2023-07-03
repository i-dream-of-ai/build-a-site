import '@/styles/globals.css';
import { Metadata } from 'next';
import NextAuthProvider from "./providers";
import NavBar from '@/app/components/navbar'
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || ''),
  title: {
    default: 'AI Site Builder',
    template: '%s | Next.js App Router',
  },
  description: 'A playground to explore our new AI Site builder.',
  themeColor: '#ffffff',
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'AI Site Builder',
    description: 'Alien Site builder, powered by AI.',
    url: 'https://ai-site-builder.com',
    siteName: 'AI Site Builder',
    locale: 'en_US',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" className="[color-scheme:dark]">
      <body className="bg-gray-1100 overflow-y-scroll bg-[url('/grid.svg')] pb-36">
      <Toaster />
      <NextAuthProvider >
        <NavBar />
        <div className="">
          <div className="mx-auto max-w-4xl space-y-8 px-2 pt-20 lg:py-8 lg:px-8">
            <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
              <div className="rounded-lg bg-black">
                <div className="flex gap-x-1 text-sm font-medium p-4">
                  <span className="px-2 text-gray-400">Build a website with AI!</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
              <div className="rounded-lg bg-black p-3.5 lg:p-6">{children}</div>
            </div>
            
          </div>
        </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
