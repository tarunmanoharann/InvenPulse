'use client'

import React from 'react'
import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import { AuthProvider } from '@/contexts/AuthContext'
import { UserProvider } from '@/contexts/UserContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  )
} 