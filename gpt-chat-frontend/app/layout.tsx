import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AuraChat',
  description: 'An AI-powered chat bot application',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
