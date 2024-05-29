import { elasticService } from "@/app/service/elasticSearch";
import type { PartialResults, QueryResult, Results } from "@/app/types/types";
import { stopWords } from '@/app/config/elasticSearch';

/**
 * This api function fetches a chunk of posts from the Elasticsearch service and analyzes them
 * It returns the progress and partial results.
 * This way the data-processing can be done in chunks, in the background, AND keep the client advised of the progress.
 *
 * route: POST /api/v1/analysis/complete
 *
 * @param {Request} request - Request object
 * @returns {Response} - Response object
 */
export async function POST(request: Request) {
  const query = await request.json() || { "": "" };
  if (Object.keys(query).length != 4) {
    return Response.json({ message: "Invalid query: lengthError", data: [] });
  }

  if (query["startPost"] === undefined || query["endPost"] === undefined || query["atPost"] === undefined || query["totalPosts"] === undefined) {
    return Response.json({ message: "Invalid query: keyError", data: [] });
  }

  // destructure the query object
  const { startPost, endPost, atPost, totalPosts, } = query;

  if (typeof startPost !== "number" || typeof endPost !== "number" || typeof atPost !== "number" || typeof totalPosts !== "number") {
    return Response.json({ message: "Invalid query: typeError", data: [] });
  }

  if (startPost < 0 || endPost < 0 || atPost < 0 || totalPosts < 0 || startPost > totalPosts || endPost > totalPosts || atPost > totalPosts) {
    return Response.json({ message: "Invalid query: valueError", data: [] });
  }

  console.log("startPost: ", startPost)
  console.log("endPost: ", endPost)
  console.log("atPost: ", atPost)
  console.log("totalPosts: ", totalPosts)

  const from = Math.max(startPost, atPost) // Ensure we don't go back in posts
  const to = Math.min(endPost, totalPosts) // Ensure we don't go over the total number of posts
  const size = Math.min(100, (to - from), (endPost - from))
  console.log("from: ", from)
  console.log("to: ", to)
  console.log("size: ", size)

  // Get the posts in the chunk
  const chunkResults = await getPostsInChunk({ from, size });

  // Analyze the posts in the chunk
  const partialAnalysis = analyzePostsInChunk(chunkResults) as PartialResults;

  // Pass on the progress
  const lastPost = chunkResults[chunkResults.length - 1]._source.post;
  const progressRate = Math.round(((lastPost-startPost) / (to -startPost)) * 100);
  const complete = lastPost >= to - 1 ? true : false;

  // Return the results
  return Response.json({ atPost: lastPost, totalPosts: totalPosts, progress: progressRate, completed: complete, partialResults: partialAnalysis });
}


/**
 * This helper function fetches a chunk of posts from the Elasticsearch service
 * It returns the posts in the chunk.
 *
 * @param {number} from - The starting post number
 * @param {number} size - The number of posts to fetch
 * @returns {QueryResult[]} - The posts in the chunk
 */
async function getPostsInChunk({ from, size }: { from: number, size: number }) {

  const httpMethod = "POST";
  const uri = `https://localhost:9200/post/_search`;
  const body = JSON.stringify({
    search_after: [from],
    size: size,
    query: {
      match_all: {}
    },
    sort: [
      {
        post: 'asc'
      }
    ]
  });

  const response = await elasticService({ body, httpMethod, uri }) as Response;
  if (!response || !response.ok) {
    return Response.json({ message: "An error occurred: no response", error: "Unknown error" });
  }
  const data = await response.json();

  if (!data || !data.hits || !data.hits.hits || data.hits.hits.length === 0) {
    return Response.json({ message: "An error occurred: no hits", error: "Unknown error" });
  }

  return data.hits.hits;
}

/**
 * This helper function analyzes the posts in a chunk
 * It returns the partial results.
 *
 * @param {QueryResult[]} posts - The posts to analyze
 * @returns {PartialResults} - The partial results
 */
function analyzePostsInChunk(posts: QueryResult[]): PartialResults {
  const realTitleWords = [] as string[];
  const realTitleWordCounts = [] as number[];
  const realTitleLengths = [] as number[];
  const realContentSentenceLengths = [] as number[];
  const realContentWords = [] as string[];
  const realContentWordCounts = [] as number[];
  const fakeTitleWords = [] as string[];
  const fakeTitleWordCounts = [] as number[];
  const fakeTitleLengths = [] as number[];
  const fakeContentSentenceLengths = [] as number[];
  const fakeContentWords = [] as string[];
  const fakeContentWordCounts = [] as number[];

  // Analyze the posts
  for (let i = 0; i < posts.length; i++) {
    // Break the title and text into words
    if (!posts[i]._source.title || !posts[i]._source.text) {
      continue;
    }
    const sourceTitle = posts[i]._source.title.trim();
    const sourceText = posts[i]._source.text.trim();
    if (sourceTitle === "" || sourceText === "") {
      continue;
    }
    const titleWords = posts[i]._source.title.split(" ");
    const titleWordCount = titleWords.length;
    const textSentences = posts[i]._source.text.split(".");

    let titleWordsArray
    let titleWordCountsArray
    let titleLengthsArray
    let contentSentenceLengthsArray
    let contentWordsArray
    let contentWordCountsArray

    // Point to the correct arrays based on the real/fake status of the post
    // This way we can analyze the real and fake posts separately without needing two separate loops
    switch (posts[i]._source.real) {
      case 1:
        titleWordsArray = realTitleWords
        titleWordCountsArray = realTitleWordCounts
        titleLengthsArray = realTitleLengths
        contentSentenceLengthsArray = realContentSentenceLengths
        contentWordsArray = realContentWords
        contentWordCountsArray = realContentWordCounts
        break;
      case 0:
        titleWordsArray = fakeTitleWords
        titleWordCountsArray = fakeTitleWordCounts
        titleLengthsArray = fakeTitleLengths
        contentSentenceLengthsArray = fakeContentSentenceLengths
        contentWordsArray = fakeContentWords
        contentWordCountsArray = fakeContentWordCounts
        break;
      default:
        continue;

    }

    if (titleWordCount > 0 && textSentences.length > 0) {

      // Analyze the title
      titleWordCountsArray.push(titleWordCount);
      if (titleWordCount > 0) {
        titleLengthsArray.push(titleWordCount);
        for (const word of titleWords) {
          const trimmedWord = word.trim().toLowerCase();
          if (!trimmedWord || trimmedWord === "" || trimmedWord === " ") {
            continue;
          }
          if (stopWords.indexOf(trimmedWord) === -1) {
            if (titleWordsArray.includes(trimmedWord)) {
              const index = titleWordsArray.indexOf(trimmedWord);
              titleWordCountsArray[index]++;
            } else {
              titleWordsArray.push(trimmedWord);
              titleWordCountsArray.push(1);
            }
          }
        }
      }

      // Analyze the text
      for (let j = 0; j < textSentences.length; j++) {
        if (!textSentences[j] || textSentences[j] === "" || textSentences[j] === " ") {
          continue;
        }
        const textWords = textSentences[j].split(" ");
        const sentenceLength = textWords.length;
        contentSentenceLengthsArray.push(sentenceLength);

        for (const word of textWords) {
          const trimmedWord = word.trim().toLowerCase();
          if (!trimmedWord || trimmedWord === "" || trimmedWord === " ") {
            continue;
          }

          if (stopWords.indexOf(trimmedWord) === -1) {
            if (contentWordsArray.includes(trimmedWord)) {
              const index = contentWordsArray.indexOf(trimmedWord);
              contentWordCountsArray[index]++;
            } else {
              contentWordsArray.push(trimmedWord);
              contentWordCountsArray.push(1);
            }
          }
        }
      }
    }
  }
  const results = {
    realTitleWords: realTitleWords,
    realTitleWordCounts: realTitleWordCounts,
    realTitleLengths: realTitleLengths,
    realContentSentenceLengths: realContentSentenceLengths,
    realContentWords: realContentWords,
    realContentWordCounts: realContentWordCounts,
    fakeTitleWords: fakeTitleWords,
    fakeTitleWordCounts: fakeTitleWordCounts,
    fakeTitleLengths: fakeTitleLengths,
    fakeContentSentenceLengths: fakeContentSentenceLengths,
    fakeContentWords: fakeContentWords,
    fakeContentWordCounts: fakeContentWordCounts
  } as PartialResults;

  return results;
}
