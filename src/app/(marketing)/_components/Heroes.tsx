import Image from 'next/image'

const Heroes = () => {
  return (
    <div className="flex max-w-5xl flex-col items-center justify-center">
      <div className="flex items-center">
        <div className="relative h-[18.75rem] w-[18.75rem] sm:h-[21.88rem] md:h-[25rem] md:w-[25rem]">
          <Image
            src="/documents.png"
            fill
            className="object-contain dark:hidden"
            alt="Documents"
          />
          <Image
            src="/documents-dark.png"
            fill
            className="hidden object-contain dark:block"
            alt="Documents"
          />
        </div>
        <div className="relative hidden h-[25rem] w-[25rem] md:block">
          <Image
            src="/reading.png"
            fill
            className="object-contain dark:hidden"
            alt="Reading"
          />
          <Image
            src="/reading-dark.png"
            fill
            className="hidden object-contain dark:block"
            alt="Reading"
          />
        </div>
      </div>
    </div>
  )
}

export default Heroes
