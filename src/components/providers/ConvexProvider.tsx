'use client'

import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ReactNode } from 'react'

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('NEXT_PUBLIC_CONVEX_URL environment variable is not defined')
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  throw new Error(
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable is not defined',
  )
}

const clerkPublishableKey: string =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

export const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}
