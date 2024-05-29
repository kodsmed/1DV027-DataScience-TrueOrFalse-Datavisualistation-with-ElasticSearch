import type { PartialResults } from "@/app/types/types";
import { combineResults } from "@/app/service/resultsService";

/**
 * This function fetches the number of posts from the backend
 *
 * @returns {Promise<number>} - The number of posts
 */
export async function loadNumberOfPosts() {
  console.log("BASE_URL: ", process.env.BASE_URL)
  const result = await fetch(`${process.env.BASE_URL}/api/v1/analysis/number-of-posts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!result || !result.ok) {
    throw new Error("Failed to fetch number of posts");
  }
  const data = await result.json();
  if (!data || !data.data) {
    throw new Error("Failed to fetch number of posts");
  }

  console.log("data: ", data.data.totalPosts)
  return data.data.totalPosts
}

/**
 * Calculates the max chunk size for processing partial results,
 * based on the percentage progress.
 * This is a linear equation that starts at (0,10) and ends at (100,2).
 *
 * This is to keep the processing time for each chunk reasonable as the total number of posts increases.
 */
export function calculateMaxChunkSize(percentageProgress: number) {
  // Calculate the constants for the linear equation:
  // Using the two points (0,10) and (100,2), we can determine a and b.
  // a = (y2 - y1) / (x2 - x1)
  // b = y1 - a * x1
  // (x1,y1) = (0,10) and (x2,y2) = (100,2)
  const a = (2 - 10) / (100 - 0);
  const b = 10;

  // Calculate maxChunkSize using the percentage progress.
  let maxChunkSize = a * percentageProgress + b;

  // Ensure maxChunkSize doesn't go below 2 or above 10.
  maxChunkSize = Math.max(2, maxChunkSize);
  maxChunkSize = Math.min(10, maxChunkSize);

  // Since maxChunkSize must be an integer, round it.
  return Math.round(maxChunkSize);
}

/**
 * Combines all the partial results into a single result.
 * This function processes the partial results array in chunks to avoid memory issues.
 * It also updates the progress state to show the progress of the combination.
 *
 * @param {PartialResults[]} partialResultsArray - The array of partial results to combine
 * @param {React.Dispatch<number>} setProgress - The state setter for the progress
 * @returns {Promise<PartialResults>} - The combined result
 */
export async function combineAllPartialResults(partialResultsArray: PartialResults[], setProgress:React.Dispatch<number>): Promise<PartialResults> {
  let progress = 0;
  let maxChunkSize = 10;
  let total = partialResultsArray.length;
  let combinedResult = {
    realTitleWords: [] as string[],
    realTitleWordCounts: [] as number[],
    fakeTitleWords: [] as string[],
    fakeTitleWordCounts: [] as number[],
    realContentWords: [] as string[],
    realContentWordCounts: [] as number[],
    fakeContentWords: [] as string[],
    fakeContentWordCounts: [] as number[],
    realTitleLengths: [] as number[],
    fakeTitleLengths: [] as number[],
    realContentSentenceLengths: [] as number[],
    fakeContentSentenceLengths: [] as number[],
  }
  let percentageProgress = 0;

  while (partialResultsArray.length > 0) {
    // Use a timeout to ensure the state update has time to process.
    await new Promise(resolve => setTimeout(resolve, 0));
    setProgress(percentageProgress);

    // Determine the chunk size, up to 10 or the remaining length of the array.
    let chunkSize = Math.min(partialResultsArray.length, maxChunkSize);
    // Get the next chunk to combine.
    let chunkToCombine = partialResultsArray.splice(0, chunkSize);

    // Combine the chunk.
    combinedResult = combineResults([combinedResult, ...chunkToCombine])

    // Update progress.
    progress += chunkSize;
    percentageProgress = Math.round((progress / total) * 100)


    if (partialResultsArray.length == 0) {
      break;
    }

    maxChunkSize = calculateMaxChunkSize(percentageProgress);

  }
  return combinedResult;
}