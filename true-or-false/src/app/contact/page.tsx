import Image from 'next/image';
import { Ballet } from 'next/font/google';
import { SocialsCard } from '../components/socialsCard';

/**
 *  Contact.tsx
 *  Renders the Contact page
 *
 * Path: '/contact'
 *
 * @param {void}
 * @returns {JSX.Element}
 */

const ballet = Ballet({ subsets: ['latin'] });

export default function Contact() {
  return (
    <div className="w-full h-4/5 mt-8 flex flex-row items-center justify-center">
      <div className="flex flex-col w-5/6 w-min-[480px] p-8 pl-4 pr-4 bg-slate-50 border-2 rounded-xl shadow-lg items-center justify-center">
        <Image
          src={`${process.env.BASE_URL}/_images_png.png`}
          alt={'logo'}
          width={250}
          height={250}
          priority={true}
        />
        <h1 style={{ fontFamily: ballet.style.fontFamily }} className="text-[50px] font-bold px-4 text-center z-10">Kodsmed</h1>
        <p className="font-bold border-t-2 border-slate-300 mt-[-24px] z-0 py-2">coding is a craft&#8482;</p>
        <div className="flex mt-8 flex-col md:flex-row gap-8 w-5/6 mx-auto flex-wrap justify-center">

          <SocialsCard imageSrc="/_images_github-mark.png" link="https://www.github.com/kodsmed/" text="github.com/kodsmed" />
          <SocialsCard imageSrc="/_images_LI-In-Bug.png" link="https://www.linkedin.com/in/kodsmed/?_l=sv_SE" text="linkedin.com/in/kodsmed" />
          <SocialsCard imageSrc="/youtube_social_circle_red.png" link="https://www.youtube.com/@Kodsmed" text="https://www.youtube.com/@Kodsmed" />


        </div>
      </div>
    </div>
  )
}
