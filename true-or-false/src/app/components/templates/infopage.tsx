import Image  from "next/image"
import { LoadingProgressCircleComponent } from "../ProgressCircleComponent"

/**
 *  This component is a template for an info page.
 *  Depending on the props, it will render a header, a logo, and up to three text rows.
 *
 * @param {string} headerText - The header text
 * @param {string} textRowOne - The first text row - optional
 * @param {string} textRowTwo - The second text row - optional
 * @param {string} textRowThree - The third text row - optional
 * @param {number} progress - The progress to show in a progress circle - optional
 * @param {boolean} logo - Whether to show the logo or not - optional
 * @returns {JSX.Element}
 */
export function InfoPage({headerText, textRowOne, textRowTwo, textRowThree, progress, logo} : {headerText: string, textRowOne?: string, textRowTwo?: string, textRowThree?: string, progress?: number, logo?: boolean}) {
    if (progress && progress < 1) {
        progress = 1;
    }
    if (progress && progress > 100) {
        progress = 100;
    }
    return (
        <div className="w-full h-4/5 mt-8 flex flex-row items-center justify-center">
          <div className="flex flex-col w-2/3 py-24 bg-slate-50 border-2 rounded-xl shadow-lg items-center justify-center">
            <h1 className="text-3xl font-bold text-center">{headerText}</h1>
            {logo && <Image src={"/logo.png"} alt="logo" aria-description="logo" width={256} height={256} priority={true}/>}
            {textRowOne && <p className="text-center">{textRowOne}</p>}
            {textRowTwo && <p className="text-center">{textRowTwo}</p>}
            <div className="mt-8">
              {progress && textRowThree && <LoadingProgressCircleComponent progress={progress} text={textRowThree}/>}
            </div>
        </div>
      </div>
    );
}