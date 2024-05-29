import { FormEventHandler } from "react"
/**
 * Renders a form for full text analysis
 *
 * @param {number} posts - The total number of posts
 * @param {number} startPost - The start post number
 * @param {number} endPost - The end post number
 * @param {Function} handleStartPostChange - Function to handle start post change and set the start post state in the parent component
 * @param {Function} handleEndPostChange - Function to handle end post change and set the end post state in the parent component
 * @param {FormEventHandler} handleSubmit - Function to handle form submit event
 * @param {string[]} estimatedTimeStrings - The strings to display along with the estimated time
 * @returns {JSX.Element}
 */
export function FullTextAnalysisForm(
  { posts, startPost, endPost, handleStartPostChange, handleEndPostChange, handleSubmit, estimatedTimeStrings }:
    { posts: number, startPost: number, endPost: number, handleStartPostChange: Function, handleEndPostChange: Function, handleSubmit: FormEventHandler, estimatedTimeStrings: string[] }
) {

  return (
    <div className="w-full h-4/5 flex flex-row items-center justify-center">
      <div className="flex flex-col w-2/3 py-12 bg-slate-50 p-4 border-2 rounded-xl shadow-lg justify-center">
        <div className="flex flex-col justify-center items-left p-8">
          <h2 className="text-3xl w-full text-center font-bold mb-8">Full text analysis</h2>
          <p>This page will give you a comprehensive analysis of the dataset...</p>
          <p>Up to all {posts} posts</p>
          <p>while this may provide interesting incites, the process will take some time.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col w-full pl-8 pr-8 space-y-8">
          <div className="flex flex-col w-full border-2 rounded-xl shadow-lg pt-8 pb-8 pl-16 pr-16">
            <label htmlFor="startPost" className="font-bold">
              Start the analysis from post:
            </label>
            <input
              type="range"
              name="startPost"
              min="0"
              step="100"
              max={posts - 1000}
              value={startPost}
              onChange={(event) => { handleStartPostChange(event) }}
            />
            <p>{startPost}</p>
          </div>
          <div className="flex flex-col w-full border-2 rounded-xl shadow-lg pt-8 pb-8 pl-16 pr-16">
            <label htmlFor="endPost" className="font-bold">
              End the analysis at post:
            </label>
            <input
              type="range"
              name="endPost"
              min="1000"
              max={posts}
              value={endPost}
              onChange={(event) => { handleEndPostChange(event) }}
            />
            <p>{endPost}</p>
          </div>
          <div className="flex flex-col w-full border-2 rounded-xl shadow-lg pt-8 pb-8 pl-16 pr-16">
            <p className="font-bold mb-4">Selected range:</p>
            <p> {startPost} &lt;-&gt; {endPost}, total: {endPost - startPost} posts</p>
            <div>
              <p className="mt-2 inline">Estimated time:</p>
              {estimatedTimeStrings[0] && <p className="mt-2 inline"> {estimatedTimeStrings[0]} </p>}
              {estimatedTimeStrings[1] && <p className="mt-2"> {estimatedTimeStrings[1]} </p>}
              {estimatedTimeStrings[2] && <a href={estimatedTimeStrings[2]} target="_blank"><p className="mt-2 text-sm"> {estimatedTimeStrings[2]} </p></a>}
            </div>
            <button type="submit" className="bg-slate-800 hover:bg-slate-600 dark:bg-slate-100 dark:hover:bg-slate-300 text-white dark:text-slate-800 rounded-lg p-2 mt-4">
              Start analysis
            </button>
          </div>
        </form>
      </div >
    </div>
  )
}
