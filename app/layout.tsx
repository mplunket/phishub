import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'
import { Metadata } from 'next'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Phishub - Phish Tabs, Chords, and Lessons',
  description: 'Find and learn Phish songs with guitar tabs, chords, and video lessons. The ultimate resource for Phish fans and musicians.',
  keywords: 'Phish, tabs, chords, guitar, lessons, jam band, rock',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
        <Footer />
        <Toaster richColors />
      </body>
    </html>
  )
}