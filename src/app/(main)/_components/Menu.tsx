'use client'

import { useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import { MoreHorizontal, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'

type MenuProps = {
  documentId: Id<'documents'>
}

const Menu = ({ documentId }: MenuProps) => {
  const router = useRouter()
  const { user } = useUser()

  const archive = useMutation(api.documents.archive)

  const onArchive = () => {
    const promise = archive({ id: documentId })

    toast.promise(promise, {
      loading: 'Moving to trash...',
      success: 'Document moved to trash',
      error: 'Failed to move document to trash',
    })

    router.push('/documents')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem onClick={onArchive}>
          <Trash className="mr-2 h-4 w-4 text-muted-foreground" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="p-2 text-xs text-muted-foreground">
          Last edited by: {user?.fullName ?? 'Unknown'}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-8 w-8" />
}

export default Menu
