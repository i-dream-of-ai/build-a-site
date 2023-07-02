import '@/styles/globals.css';
import { Metadata } from 'next';
import NextAuthProvider from "./providers";
import { Session } from 'next-auth'
import { headers } from 'next/headers'
import NavBar from '@/app/components/NavBar'
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


async function getSession(cookie: string): Promise<Session> {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
    headers: {
      cookie,
    },
  });

  const session = await response.json();

  return Object.keys(session).length > 0 ? session : null;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await getSession(headers().get('cookie') ?? '');

  return (
    <html lang="en" className="[color-scheme:dark]">
      <body className="bg-gray-1100 overflow-y-scroll bg-[url('/grid.svg')] pb-36">
      <Toaster />
      <NextAuthProvider >
        <NavBar session={session}/>
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
