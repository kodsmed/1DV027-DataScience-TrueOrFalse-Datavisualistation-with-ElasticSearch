import React from 'react';
import { Results } from '@/app/types/types';
import { BarListComponent } from '@/app/components/BarListComponent';
import { stopWords } from '@/app/config/elasticSearch';
/**
 * Renders the results of the analysis.
 *
 * @param {Results} results - The results of the analysis
 * @returns {JSX.Element}
 */
export function ResultComponent({ results }: { results: Results }) {
  return (
    <div className = "w-full h-full flex-col p-4">
      <div className='w-full flex flex-row space-x-4 justify-center'>
        <ResultElement result={results} keyword='real' />
        <ResultElement result={results} keyword='fake' />
      </div>
      <p className='text-xs text-slate-700 italic mt-8'>* not included{stopWords.join(', ')}</p>
    </div>

  );
}

function ResultElement({ result, keyword }: { result: Results, keyword: 'real' | 'fake' }) {
  const tableLabel = keyword === 'real' ? 'Real' : 'Fake';
  const titleWords = keyword === 'real' ? result.realTitleWords : result.fakeTitleWords;
  const titleLengthsAverage = keyword === 'real' ? result.realTitleLengthsAverage : result.fakeTitleLengthsAverage;
  const contentWords = keyword === 'real' ? result.realContentWords : result.fakeContentWords;

  const titleDistinctNonStopWordsAverage = keyword === 'real' ? result.realTitleDistinctNonStopWordsAverage : result.fakeTitleDistinctNonStopWordsAverage;
  const contentSentenceLengthsAverage = keyword === 'real' ? result.realContentSentenceLengthsAverage : result.fakeContentSentenceLengthsAverage;
  const contentDistinctNonStopWordsAverage = keyword === 'real' ? result.realContentDistinctNonStopWordsAverage : result.fakeContentDistinctNonStopWordsAverage;

  const wordListTitle = [] as { name: string, value: number, key:number }[];
  let key = 0;
  titleWords.forEach((word) => {
    wordListTitle.push({ name: word.word, value: word.count, key: key++});
  });

  key = 0;
  const wordListContent = [] as { name: string, value: number, key:number }[];
  contentWords.forEach((word) => {
    wordListContent.push({ name: word.word, value: word.count, key: key++});
  });


  return (
    <div className='flex flex-col justify-left items-left space-y-4'>
      <div className='text-2xl'>{tableLabel}</div>
      <div>
        <h3>
          Most common words in title
        </h3>
        <div>
          <BarListComponent incomingData={wordListTitle} />

          <div>
            <h4>Average title<span className='text-red-700'>*</span></h4>
            <p>{tableLabel} news articles in the dataset have an average {titleLengthsAverage} words / title.</p>
            <p>{tableLabel} news articles in the dataset have an average of {titleDistinctNonStopWordsAverage} distinct non-stop words / title.</p>
          </div>
        </div>
      </div>

      <div>
        <h3>
          Most common words in content
        </h3>
        <div>
          <BarListComponent incomingData={wordListContent} />

          <div>
            <h4>Average content<span className='text-red-700'>*</span></h4>
            <p>The average sentence in a {keyword} article is {contentSentenceLengthsAverage} words long</p>
            <p>{tableLabel} news articles in the dataset have an average of {contentDistinctNonStopWordsAverage} distinct non-stop words / content.</p>
          </div>
        </div>
      </div>
    </div>
  );
}