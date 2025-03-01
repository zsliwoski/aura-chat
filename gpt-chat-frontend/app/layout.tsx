import type { Metadata } from 'next'
import './globals.css'
import SessionProvider from "../components/session-provider";
import { getServerSession } from 'next-auth'
import { authOptions } from "./api/auth/[...nextauth]/route";

export const metadata: Metadata = {
  title: 'AuraChat',
  description: 'An AI-powered chat bot application',
  generator: 'Next.js',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
