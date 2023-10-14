import Logo from './Logo'

import { Button } from '@/components/ui/button'

const Footer = () => {
  return (
    <footer className="z-50 flex w-full items-center bg-background p-6 dark:bg-[#1f1f1f]">
      <Logo />
      <div className="flex w-full items-center justify-between gap-x-2 text-muted-foreground md:ml-auto md:justify-end">
        <Button variant="ghost" size="sm">
          Privacy Policy
        </Button>
        <Button variant="ghost" size="sm">
          Terms & Conditions
        </Button>
      </div>
    </footer>
  )
}

export default Footer
