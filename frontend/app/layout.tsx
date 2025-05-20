import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import Providers from '@/components/Providers'
import Header from '@/components/Header'
import { Suspense } from 'react'
import Loading from './loading'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InvenPulse - Inventory Management System',
  description: 'Modern inventory management system for businesses of all sizes',
}
<<<<<<< HEAD

=======
>>>>>>> parent of b1db282 (Version 2.0)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Toaster />
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
            <Header />
            <main className="flex-grow">
              <Suspense fallback={<Loading />}>
                {children}
              </Suspense>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
} 