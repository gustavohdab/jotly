import { useMutation } from 'convex/react'
import { ImageIcon, X } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'

import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

import { useCoverImage } from '@/hooks/useCoverImage'
import { useEdgeStore } from '@/lib/edgestore'
import { cn } from '@/lib/utils'

type CoverProps = {
  url?: string
  preview?: boolean
}

const Cover = ({ url, preview }: CoverProps) => {
  const { edgestore } = useEdgeStore()
  const params = useParams()
  const coverImage = useCoverImage()
  const removeCoveImage = useMutation(api.documents.removeCoverImage)

  const onRemove = async () => {
    if (!url) return

    await edgestore.publicFiles.delete({ url })

    const promise = removeCoveImage({
      id: params.documentId as Id<'documents'>,
    })

    toast.promise(promise, {
      loading: 'Removing cover image...',
      success: 'Cover image removed.',
      error: 'Failed to remove cover image.',
    })
  }

  return (
    <div
      className={cn(
        'group relative h-[35vh] w-full',
        !url && 'h-[12vh]',
        url && 'bg-muted',
      )}
    >
      {!!url && (
        <Image src={url} fill alt="Cover Image" className="object-cover" />
      )}
      {url && !preview && (
        <div className="absolute bottom-5 right-5 float-right items-center gap-x-2 opacity-0 group-hover:opacity-100">
          <Button
            className="mr-2 text-xs text-muted-foreground"
            variant="outline"
            size="sm"
            onClick={() => coverImage.onReplace(url)}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Change cover
          </Button>
          <Button
            className="text-xs text-muted-foreground"
            variant="outline"
            size="sm"
            onClick={onRemove}
          >
            <X className="mr-2 h-4 w-4" />
            Remove cover
          </Button>
        </div>
      )}
    </div>
  )
}

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="h-[12vh] w-full" />
}

export default Cover
