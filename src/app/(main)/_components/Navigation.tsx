'use client'

import { useMutation } from 'convex/react'
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from 'lucide-react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { ElementRef, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useMediaQuery } from 'usehooks-ts'

import { api } from '../../../../convex/_generated/api'

import DocumentList from './DocumentList'
import Item from './Item'
import Navbar from './Navbar'
import TrashBox from './TrashBox'
import UserItem from './UserItem'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useSearch } from '@/hooks/useSearch'
import { useSettings } from '@/hooks/useSettings'
import { cn } from '@/lib/utils'

const Navigation = () => {
  const router = useRouter()
  const search = useSearch()
  const settings = useSettings()
  const params = useParams()
  const pathname = usePathname()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const create = useMutation(api.documents.create)

  const isResizingRef = useRef(false)
  const sidebarRef = useRef<ElementRef<'aside'>>(null)
  const navbarRef = useRef<ElementRef<'div'>>(null)

  const [isResetting, setIsResetting] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(isMobile)

  useEffect(() => {
    if (isMobile) {
      collapse()
    } else {
      resetWidth()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile])

  useEffect(() => {
    if (isMobile) {
      collapse()
    }
  }, [pathname, isMobile])

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    isResizingRef.current = true
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return

    let newWidth = event.clientX

    if (newWidth < 240) newWidth = 240
    if (newWidth > 480) newWidth = 480

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`
      navbarRef.current.style.setProperty('left', `${newWidth}px`)
      navbarRef.current.style.setProperty('width', `calc(100% - ${newWidth}px)`)
    }
  }

  const handleMouseUp = () => {
    isResizingRef.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false)
      setIsResetting(true)

      sidebarRef.current.style.width = isMobile ? '100%' : '15rem'
      navbarRef.current.style.setProperty(
        'width',
        isMobile ? '0' : 'calc(100% - 15rem)',
      )
      navbarRef.current.style.setProperty('left', isMobile ? '100%' : '15rem')

      setTimeout(() => {
        setIsResetting(false)
      }, 300)
    }
  }

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true)
      setIsResetting(true)

      sidebarRef.current.style.width = '0'
      navbarRef.current.style.setProperty('width', '100%')
      navbarRef.current.style.setProperty('left', '0')

      setTimeout(() => {
        setIsResetting(false)
      }, 300)
    }
  }

  const handleCreate = () => {
    const promise = create({
      title: 'Untitled',
    }).then((documentId) => router.push(`/documents/${documentId}`))

    toast.promise(promise, {
      loading: 'Creating note...',
      success: 'Note created!',
      error: 'Failed to create note',
    })
  }

  return (
    <>
      <aside
        className={cn(
          'group/sidebar relative z-[99999] flex h-full w-60 flex-col overflow-y-auto bg-secondary',
          isResetting && 'transition-all duration-300 ease-in-out',
          isMobile && 'w-0',
        )}
        ref={sidebarRef}
      >
        <div
          className={cn(
            'absolute right-2 top-3 h-6 w-6 rounded-sm text-muted-foreground opacity-0 transition hover:bg-neutral-300 group-hover/sidebar:opacity-100 dark:hover:bg-neutral-600',
            isMobile && 'opacity-100',
          )}
          role="button"
          onClick={collapse}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div className="">
          <UserItem />
          <Item label="Search" icon={Search} isSearch onClick={search.onOpen} />
          <Item label="Settings" icon={Settings} onClick={settings.onOpen} />
          <Item onClick={handleCreate} label="New page" icon={PlusCircle} />
        </div>
        <div className="mt-4">
          <DocumentList />
          <Item onClick={handleCreate} label="Add a page" icon={Plus} />
          <Popover>
            <PopoverTrigger className="mt-4 w-full">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              side={isMobile ? 'bottom' : 'right'}
              className="w-72 p-0"
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-primary/10 opacity-0 transition group-hover/sidebar:opacity-100"
        />
      </aside>
      <div
        className={cn(
          'absolute left-60 top-0 z-[99999] w-[calc(100%-15rem)]',
          isResetting && 'transition-all duration-300 ease-in-out',
          isMobile && 'left-0 w-full',
        )}
        ref={navbarRef}
      >
        {params.documentId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          <nav className="w-full bg-transparent px-3 py-2">
            {isCollapsed && (
              <MenuIcon
                className="h-6 w-6 text-muted-foreground"
                role="button"
                onClick={resetWidth}
              />
            )}
          </nav>
        )}
      </div>
    </>
  )
}

export default Navigation
