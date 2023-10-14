'use client'

import { useUser } from '@clerk/clerk-react'
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'
import { useMutation } from 'convex/react'
import {
  ChevronDown,
  ChevronRight,
  Command,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type ItemProps = {
  id?: Id<'documents'>
  documentIcon?: string
  active?: boolean
  expanded?: boolean
  isSearch?: boolean
  level?: number
  onExpand?: () => void
  onClick?: () => void
  label: string
  icon: LucideIcon
}

const Item = ({
  label,
  onClick,
  icon: Icon,
  id,
  active,
  documentIcon,
  expanded,
  isSearch,
  level = 0,
  onExpand,
}: ItemProps) => {
  const { user } = useUser()

  const router = useRouter()

  const create = useMutation(api.documents.create)
  const archive = useMutation(api.documents.archive)

  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    if (!id) return
    const promise = archive({ id }).then(() => {
      router.push(`/documents`)
    })

    toast.promise(promise, {
      loading: 'Moving note to trash...',
      success: 'Note moved to trash!',
      error: 'Failed to move note to trash.',
    })
  }

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.stopPropagation()
    onExpand?.()
  }

  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    if (!id) return
    const promise = create({ title: 'Untitled', parentDocument: id }).then(
      (documentId) => {
        if (!expanded) {
          onExpand?.()
        }
        router.push(`/documents/${documentId}`)
      },
    )

    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note.',
    })
  }

  const ChevronIcon = expanded ? ChevronDown : ChevronRight

  return (
    <div
      onClick={onClick}
      role="button"
      style={{
        paddingLeft: level ? `${level * 0.75 + 0.75}rem` : '.75rem',
      }}
      className={cn(
        'group flex min-h-[1.6875rem] w-full items-center py-1 pr-3 text-sm font-medium text-muted-foreground hover:bg-primary/5',
        active && 'bg-primary/5 text-primary',
      )}
    >
      {!!id && (
        <div
          role="button"
          onClick={handleExpand}
          className="mr-1 h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="mr-2 shrink-0 text-[1.125rem]">{documentIcon}</div>
      ) : (
        <Icon className="light:text-primary-foreground mr-2 h-[1.125rem] w-[1.125rem] shrink-0" />
      )}
      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[.625rem] font-medium text-muted-foreground opacity-100 ">
          <span className="text-xs">
            <Command className="h-2 w-2" />
          </span>
          K
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div
                className="ml-auto h-full rounded-sm opacity-0 hover:bg-neutral-300 group-hover:opacity-100 dark:hover:bg-neutral-600"
                role="button"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={onArchive}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="p-2 text-xs text-muted-foreground">
                Last edited by: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            className="ml-auto h-full rounded-sm opacity-0 hover:bg-neutral-300 group-hover:opacity-100 dark:hover:bg-neutral-600"
            role="button"
            onClick={onCreate}
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}

Item.Skeleton = function ItemSkeleton({ level = 0 }: { level?: number }) {
  return (
    <div
      className="flex gap-x-2 py-[.1875rem]"
      style={{ paddingLeft: level ? `${level * 0.75 + 1.5625}rem` : '.75rem' }}
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  )
}

export default Item
