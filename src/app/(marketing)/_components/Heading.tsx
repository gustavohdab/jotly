'use client'

import { SignInButton } from '@clerk/clerk-react'
import { useConvexAuth } from 'convex/react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Button, buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const Heading = () => {
  const { isLoading, isAuthenticated } = useConvexAuth()

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl">
        Your Ideas, Documents, & Plans. Unified. Welcome to{' '}
        <span className="underline">Jotly</span>
      </h1>
      <h3 className="text-base font-medium sm:text-xl md:text-2xl">
        Jotly is the connected workspace where <br />
        better, faster works happens.
      </h3>
      {isLoading && (
        <div className="flex items-center justify-center">
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Link href="/documents" className={buttonVariants()}>
          Enter Jotly
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      )}
      {!isAuthenticated && !isLoading && (
        <SignInButton mode="modal">
          <Button>
            Get Jotly Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </SignInButton>
      )}
    </div>
  )
}

export default Heading
