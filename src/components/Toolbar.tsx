'use client'

import { useMutation } from 'convex/react'
import { ImageIcon, Smile, X } from 'lucide-react'
import { useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import { api } from '../../convex/_generated/api'
import { Doc } from '../../convex/_generated/dataModel'

import IconPicker from './IconPicker'
import { Button } from './ui/button'

import { useCoverImage } from '@/hooks/useCoverImage'

type ToolbarProps = {
  initialData: Doc<'documents'>
  preview?: boolean
}

const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialData.title)
  const coverImage = useCoverImage()

  const update = useMutation(api.documents.update)

  const enableInput = () => {
    if (preview) return

    setIsEditing(true)
    setTimeout(() => {
      setValue(initialData.title)
      inputRef.current?.focus()
    }, 0)
  }

  const disableInput = () => setIsEditing(false)

  const onInput = (value: string) => {
    setValue(value)
    update({ id: initialData._id, title: value || 'Untitled' })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      disableInput()
    }
  }

  const onIconSelect = (icon: string) => {
    update({ id: initialData._id, icon })
  }

  const remove = useMutation(api.documents.remove)

  const onIconRemove = () => {
    remove({ id: initialData._id })
  }

  return (
    <div className="group relative pl-[3.375rem]">
      {!!initialData.icon && !preview && (
        <div className="group/icon flex items-center gap-x-2 pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl transition hover:opacity-75">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onIconRemove}
            className="rounded-full text-xs text-muted-foreground opacity-0 transition group-hover/icon:opacity-100"
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className="pt-6 text-6xl">{initialData.icon}</p>
      )}
      <div className="flex items-center gap-x-1 py-4 opacity-0 group-hover:opacity-100">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-xs text-muted-foreground"
              variant="outline"
              size="sm"
            >
              <Smile className="mr-2 h-4 w-4" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            onClick={coverImage.onOpen}
            className="text-xs text-muted-foreground"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Add cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="resize-none break-words bg-transparent text-5xl font-bold text-[#3F3F3F] outline-none dark:text-[#CFCFCF]"
        />
      ) : (
        <div
          onClick={enableInput}
          className="break-words pb-[11.5px] text-5xl font-bold text-[#3F3F3F] outline-none dark:text-[#CFCFCF]"
        >
          {initialData.title}
        </div>
      )}
    </div>
  )
}

export default Toolbar
