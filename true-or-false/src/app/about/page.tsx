/**
 *  AboutTheData
 *  Renders the About the data page
 *
 * Path: '/about'
 *
 * @param {void}
 * @returns {JSX.Element}
 */
export default function AboutTheData() {
  return(
  <div className="w-full h-4/5 mt-8 flex flex-row items-center justify-center">
    <div className="flex flex-col w-4/5 py-24 pl-4 pr-4 bg-slate-50 border-2 rounded-xl shadow-lg items-center justify-center">
      <h1 className="text-3xl font-bold text-center">About the data</h1>
      <div className="mt-8 flex-col w-full flew-wrap">
        <p className="text-center">The dataset used in the application is the <a href="https://www.kaggle.com/datasets/saurabhshahane/fake-news-classification" target="_blank" className="font-bold text-blue-500">Fake News Classification</a> dataset from Kaggle,</p>
        <p className="text-center"> created by <a href="https://www.kaggle.com/saurabhshahane" target="_blank" className="font-bold text-blue-500">Saurabh Shahane</a></p>
        <p className="text-center">and used under the <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" className="font-bold text-blue-500">CC BY 4.0 license</a>.</p>
        <p className="text-center mt-8">The dataset is version 77, containing 72134 articles.</p>
      </div>
    </div>
  </div>
  )
}