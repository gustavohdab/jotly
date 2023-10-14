'use client'

import { SignInButton, UserButton } from '@clerk/clerk-react'
import { useConvexAuth } from 'convex/react'
import Link from 'next/link'

import Logo from './Logo'

import { ModeToggle } from '@/components/ThemeToggle'
import { Button, buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useScrollTop } from '@/hooks/useScrollTop'
import { cn } from '@/lib/utils'

const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth()

  const scrolled = useScrollTop()
  return (
    <div
      className={cn(
        'fixed top-0 z-50 flex w-full items-center bg-background p-6 dark:bg-[#1f1f1f]',
        scrolled && 'border-b shadow-sm',
      )}
    >
      <Logo />
      <div className="flex w-full items-center justify-between gap-x-2 md:ml-auto md:justify-end">
        {isLoading && (
          <>
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </>
        )}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size="sm">Get Jotly Free</Button>
            </SignInButton>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <Link
              href="/documents"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
              })}
            >
              Enter Jotly
            </Link>
            <UserButton afterSignOutUrl="/" />
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  )
}

export default Navbar
