'use client'

import EmojiPicker, { Theme } from 'emoji-picker-react'
import { useTheme } from 'next-themes'

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
type IconPickerProps = {
  onChange: (icon: string) => void
  children: React.ReactNode
  asChild?: boolean
}

const IconPicker = ({ onChange, children, asChild }: IconPickerProps) => {
  const { resolvedTheme } = useTheme()

  const themeMap = {
    dark: Theme.DARK,
    light: Theme.LIGHT,
  }

  const currentTheme = (resolvedTheme || 'light') as keyof typeof themeMap

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent className="w-full border-none p-0 shadow-none">
        <EmojiPicker height={350} theme={themeMap[currentTheme]} />
      </PopoverContent>
    </Popover>
  )
}

export default IconPicker
