import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

import { ConvexClientProvider } from '@/components/providers/ConvexProvider'
import { ModalProvider } from '@/components/providers/ModalProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import './globals.css'
import { EdgeStoreProvider } from '@/lib/edgestore'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jotly',
  description: 'The connected note-taking app for teams.',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/logo.svg',
        href: '/logo.svg',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/logo-dark.svg',
        href: '/logo-dark.svg',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClientProvider>
          <EdgeStoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              storageKey="jotly-theme"
            >
              <Toaster position="bottom-center" />
              <ModalProvider />
              {children}
            </ThemeProvider>
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
