'use client'

import { useMutation } from 'convex/react'
import { useRef, useState } from 'react'

import { api } from '../../../../convex/_generated/api'
import { Doc } from '../../../../convex/_generated/dataModel'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

type TitleProps = {
  initialData: Doc<'documents'>
}

const Title = ({ initialData }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const update = useMutation(api.documents.update)

  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(initialData.title ?? 'Untitled')

  const enableInput = () => {
    setIsEditing(true)
    setTitle(initialData.title ?? 'Untitled')
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
    }, 0)
  }

  const disableInput = () => {
    setIsEditing(false)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    update({
      id: initialData._id,
      title: e.target.value,
    })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      disableInput()
    }
  }

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          className="h-7 px-2 focus-visible:ring-transparent"
          ref={inputRef}
          value={title}
          onChange={onChange}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
        />
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-1 font-normal"
          onClick={enableInput}
        >
          <span className="truncate">{initialData.title}</span>
        </Button>
      )}
    </div>
  )
}

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-6 w-16 rounded-md" />
}

export default Title
