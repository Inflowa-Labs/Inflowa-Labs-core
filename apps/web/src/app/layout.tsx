import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/lib/query-client'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Inflowa Labs - Personal Income Streams Dashboard',
  description: 'A revolutionary DeFi platform that transforms how individuals receive and manage income through continuous money streaming on Stellar Soroban',
  keywords: ['DeFi', 'Stellar', 'Soroban', 'income streaming', 'personal finance', 'blockchain'],
  authors: [{ name: 'Inflowa Labs' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
