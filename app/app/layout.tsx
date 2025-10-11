import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers/Providers'

export const metadata: Metadata = {
  title: 'Guru Seva Mandali | Shri Raghavendra Swamy Temple',
  description: 'Guru Seva Mandali - Shri Raghavendra Swamy Brundavana Sannidhi - Donations & Pooja Bookings',
  keywords: ['temple', 'donation', 'pooja', 'booking', 'sri raghavendra swamy', 'guru seva mandali'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
