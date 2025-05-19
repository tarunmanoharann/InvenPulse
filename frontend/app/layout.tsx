'use client';

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import Providers from '@/components/Providers'
import Header from '@/components/Header'
import { Suspense } from 'react'
import Loading from './loading'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
            {!isDashboard && <Header />}
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