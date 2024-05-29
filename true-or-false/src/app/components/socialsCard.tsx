import Image from 'next/image'
/**
 * SocialsCard component
 *
 * @description takes a image uri , a link href and a text to display and returns a card with the image, text and link
 * @returns {JSX.Element}
 */
export function SocialsCard({ imageSrc, link, text }: { imageSrc: string, link: string, text: string }) {
  return (
    <a href={link} target="_blank" rel="noreferrer">
      <div className='flex flex-row items-center w-[400px] border-2 border-slate-200 rounded-lg shadow-md p-4 cursor-pointer'>

        <Image src={`${process.env.BASE_URL}${imageSrc}`} alt={text} width={40} height={40} priority={true} className='inline' />
        <p className='text-medium font-bold underline ml-2 grow text-center'>{text}</p>
      </div>
    </a>
  )
}
