import type { PartialResults, Results } from "@/app/types/types";

/**
 * Combines all the partial results into a single result.
 * This function processes the partial results array in chunks to avoid memory issues,
 * although it can be called with any number of partial results.
 *
 * @param  {PartialResults[]} results - The array of partial results to combine
 * @returns {PartialResults} - The combined result
 */
export function combineResults(results: PartialResults[]): PartialResults {
  let result = {
    // Use Maps for word counts
    realTitleWordCounts: new Map<string, number>(),
    fakeTitleWordCounts: new Map<string, number>(),
    realContentWordCounts: new Map<string, number>(),
    fakeContentWordCounts: new Map<string, number>(),

    // Keep arrays for lengths
    realTitleLengths: [] as number[],
    fakeTitleLengths: [] as number[],
    realContentSentenceLengths: [] as number[],
    fakeContentSentenceLengths: [] as number[],
  };

  console.log('combining results:', results.length);
  results.forEach(partialResult => {
    // Real Title Words
    partialResult.realTitleWords.forEach((word, index) => {
      result.realTitleWordCounts.set(word, (result.realTitleWordCounts.get(word) || 0) + partialResult.realTitleWordCounts[index]);
    });

    // Fake Title Words
    partialResult.fakeTitleWords.forEach((word, index) => {
      result.fakeTitleWordCounts.set(word, (result.fakeTitleWordCounts.get(word) || 0) + partialResult.fakeTitleWordCounts[index]);
    });

    // Real Content Words
    partialResult.realContentWords.forEach((word, index) => {
      result.realContentWordCounts.set(word, (result.realContentWordCounts.get(word) || 0) + partialResult.realContentWordCounts[index]);
    });

    // Fake Content Words
    partialResult.fakeContentWords.forEach((word, index) => {
      result.fakeContentWordCounts.set(word, (result.fakeContentWordCounts.get(word) || 0) + partialResult.fakeContentWordCounts[index]);
    });

    // Lengths can be concatenated directly
    result.realTitleLengths = result.realTitleLengths.concat(partialResult.realTitleLengths);
    result.fakeTitleLengths = result.fakeTitleLengths.concat(partialResult.fakeTitleLengths);
    result.realContentSentenceLengths = result.realContentSentenceLengths.concat(partialResult.realContentSentenceLengths);
    result.fakeContentSentenceLengths = result.fakeContentSentenceLengths.concat(partialResult.fakeContentSentenceLengths);
  });

  // Convert Maps back to arrays
  return {
    realTitleWords: [...result.realTitleWordCounts.keys()],
    realTitleWordCounts: [...result.realTitleWordCounts.values()],
    fakeTitleWords: [...result.fakeTitleWordCounts.keys()],
    fakeTitleWordCounts: [...result.fakeTitleWordCounts.values()],
    realContentWords: [...result.realContentWordCounts.keys()],
    realContentWordCounts: [...result.realContentWordCounts.values()],
    fakeContentWords: [...result.fakeContentWordCounts.keys()],
    fakeContentWordCounts: [...result.fakeContentWordCounts.values()],
    realTitleLengths: result.realTitleLengths,
    fakeTitleLengths: result.fakeTitleLengths,
    realContentSentenceLengths: result.realContentSentenceLengths,
    fakeContentSentenceLengths: result.fakeContentSentenceLengths,
  };
}

/**
 * Creates the final result object from the combined partial results.
 *
 * @param {PartialResults} result - The combined partial results
 * @param {number} numberOfPosts - The number of posts in the dataset
 * @returns {Results} - The final result object
 */
export function createEndResult(result: PartialResults, numberOfPosts: number): Results {
  console.log ('createEndResult')
  console.log ("result: ", result)
  console.log ("numberOfPosts: ", numberOfPosts)
  if (numberOfPosts <= 0) {
    return {
      realTitleWords: [],
      realTitleLengthsAverage: 0,
      realTitleDistinctNonStopWordsAverage: 0,
      realContentWords: [],
      realContentSentenceLengthsAverage: 0,
      realContentDistinctNonStopWordsAverage: 0,
      fakeTitleWords: [],
      fakeTitleLengthsAverage: 0,
      fakeTitleDistinctNonStopWordsAverage: 0,
      fakeContentWords: [],
      fakeContentSentenceLengthsAverage: 0,
      fakeContentDistinctNonStopWordsAverage: 0
    } as Results;
  }
  let realTitleWords = [] as { word: string, count: number }[];
  let fakeTitleWords = [] as { word: string, count: number }[];

  // Create a new array of {word, count} objects
  const realWordList = [] as { word: string, count: number }[];
  for (let i = 0; i < result.realTitleWords.length; i++) {
    realWordList.push(
      {
        word: result.realTitleWords[i],
        count: result.realTitleWordCounts[i]
      }
    );
  }

  const fakeWordList = [] as { word: string, count: number }[];
  for (let i = 0; i < result.fakeTitleWords.length; i++) {
    fakeWordList.push(
      {
        word: result.fakeTitleWords[i],
        count: result.fakeTitleWordCounts[i]
      }
    );
  }

  // Find the most common words in the titles
  realTitleWords = realWordList.sort((a, b) => b.count - a.count).slice(0, 10);
  fakeTitleWords = fakeWordList.sort((a, b) => b.count - a.count).slice(0, 10);

  // Find the most common words in the content
  const realContentWords = [] as { word: string, count: number }[];
  const fakeContentWords = [] as { word: string, count: number }[];

  for (let i = 0; i < 10; i++) {
    const realIndex = getIndexOfMax(result.realContentWordCounts);
    if (realIndex !== -1) {
      realContentWords.push(
        {
          word: result.realContentWords[realIndex],
          count: result.realContentWordCounts[realIndex]
        }
      );
      result.realContentWordCounts.splice(realIndex, 1);
      result.realContentWords.splice(realIndex, 1);
    }
    const fakeIndex = getIndexOfMax(result.fakeContentWordCounts);
    if (fakeIndex !== -1) {
      fakeContentWords.push(
        {
          word: result.fakeContentWords[fakeIndex],
          count: result.fakeContentWordCounts[fakeIndex]
        }
      );
      result.fakeContentWordCounts.splice(fakeIndex, 1);
      result.fakeContentWords.splice(fakeIndex, 1);
    }
  }

  // Calculate the average title length
  let realTitleLengthsAverage = result.realTitleLengths.reduce((a, b) => a + b, 0) / result.realTitleLengths.length;
  let fakeTitleLengthsAverage = result.fakeTitleLengths.reduce((a, b) => a + b, 0) / result.fakeTitleLengths.length;

  // Calculate the average number of distinct words in the titles
  let realTitleDistinctWordsAverage = result.realTitleWords.length / numberOfPosts;
  let fakeTitleDistinctWordsAverage = result.realTitleWords.length / numberOfPosts;

  // Calculate the average sentence length in the content
  let realContentSentenceLengthsAverage = result.realContentSentenceLengths.reduce((a, b) => a + b, 0) / result.realContentSentenceLengths.length;
  let fakeContentSentenceLengthsAverage = result.fakeContentSentenceLengths.reduce((a, b) => a + b, 0) / result.fakeContentSentenceLengths.length;

  // Calculate the average number of distinct words in the content
  let realContentDistinctWordsAverage = result.realContentWords.length / numberOfPosts;
  let fakeContentDistinctWordsAverage = result.fakeContentWords.length / numberOfPosts;

  // Round the averages to 2 decimal places
  realTitleLengthsAverage = Math.round(realTitleLengthsAverage * 100) / 100;
  fakeTitleLengthsAverage = Math.round(fakeTitleLengthsAverage * 100) / 100;
  realContentSentenceLengthsAverage = Math.round(realContentSentenceLengthsAverage * 100) / 100;
  fakeContentSentenceLengthsAverage = Math.round(fakeContentSentenceLengthsAverage * 100) / 100;
  realTitleDistinctWordsAverage = Math.round(realTitleDistinctWordsAverage * 100) / 100;
  fakeTitleDistinctWordsAverage = Math.round(fakeTitleDistinctWordsAverage * 100) / 100;
  realContentDistinctWordsAverage = Math.round(realContentDistinctWordsAverage * 100) / 100;
  fakeContentDistinctWordsAverage = Math.round(fakeContentDistinctWordsAverage * 100) / 100;

   const results = {
    realTitleWords: realTitleWords,
    realTitleLengthsAverage: realTitleLengthsAverage,
    realTitleDistinctNonStopWordsAverage: realTitleDistinctWordsAverage,
    realContentWords: realContentWords,
    realContentSentenceLengthsAverage: realContentSentenceLengthsAverage,
    realContentDistinctNonStopWordsAverage: realContentDistinctWordsAverage,
    fakeTitleWords: fakeTitleWords,
    fakeTitleLengthsAverage: fakeTitleLengthsAverage,
    fakeTitleDistinctNonStopWordsAverage: fakeTitleDistinctWordsAverage,
    fakeContentWords: fakeContentWords,
    fakeContentSentenceLengthsAverage: fakeContentSentenceLengthsAverage,
    fakeContentDistinctNonStopWordsAverage: fakeContentDistinctWordsAverage,
  }

  return results;
}

/**
 * Get the index of the maximum value in an array.
 * This exists only to avoid using the Math.max function,
 * since that will cause stack overflow errors with large arrays.
 *
 * @param {number[]} array - The array to search
 * @returns {number} - The index of the maximum value
 */
function getIndexOfMax(array: number[]): number {
  let max = 0;
  let maxIndex = -1;
  for (let i = 0; i < array.length; i++) {
    if (array[i] > max) {
      max = array[i];
      maxIndex = i;
    }
  }
  return maxIndex;
}