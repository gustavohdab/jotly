'use client'

import { useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import { PlusCircle } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { api } from '../../../../../convex/_generated/api'

import { Button } from '@/components/ui/button'

const DocumentsPage = () => {
  const router = useRouter()
  const { user } = useUser()

  const create = useMutation(api.documents.create)

  const onCreate = () => {
    const promise = create({
      title: 'Untitled',
    }).then((documentId) => {
      router.push(`/documents/${documentId}`)
    })

    toast.promise(promise, {
      loading: 'Creating note...',
      success: 'Note created.',
      error: 'Failed to create note.',
    })
  }

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        alt="Empty"
        width={300}
        height={300}
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        alt="Empty"
        width={300}
        height={300}
        className="hidden dark:block"
      />
      <h2>Welcome to {user?.firstName}&apos;s Jotly.</h2>
      <Button onClick={onCreate} type="button">
        <PlusCircle className="mr-2 h-4 w-4" />
        Create a note
      </Button>
    </div>
  )
}

export default DocumentsPage
