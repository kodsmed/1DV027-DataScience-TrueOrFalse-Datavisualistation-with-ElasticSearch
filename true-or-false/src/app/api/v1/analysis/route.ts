import { elasticService } from "@/app/service/elasticSearch";
/**
 * This api function fetches the the number of real and fake posts that match the search query
 *
 * @param request - The request object from the client - { title: string } or { content: string }
 * @returns - The response object to send back to the client - { verdict: 'real'|'fake'|'unknown', odds:number, real: realCount, fake: fakeCount }
 */
export async function POST(request: Request) {
  try {
    const query = await request.json() || { "": "" };
    let queryKey = Object.keys(query)[0];
    const value = query[queryKey];
    let key = queryKey;
    switch (queryKey) {
      case "title":
        return getDocumentCounts({ key, value });
      case "content":
        key = 'text';
        return getDocumentCounts({ key, value });
      default:
        return Response.json({ message: "Invalid query", data: [] });
    }
  }
  catch (error) {
    console.error(error);
    return Response.json({ message: "An error occurred", error: "Unknown error" });
  }
}

/**
 * This helper function fetches the the number of real and fake posts that match the search query
 * It returns the response object to send back to the client
 */
async function getDocumentCounts({ key, value }: { key: string, value: string }) {
  let method = "match";

  //If the query is wrapped in quotes, we need to use match_phrase
  if(value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
    method = "match_phrase";
    console.log('method: ' + method);
    value = value.slice(1, -1);
  } ;

  const bodyReal = JSON.stringify({
    query: {
      bool: {
        must: [
          {
            [method]: { [key]: value }
          }
        ],
        filter: [
          {
            term: { real: 1 }
          }
        ]
      }
    }
  })

  const bodyFake = JSON.stringify({
    query: {
      bool: {
        must: [
          {
            [method]: { [key]: value }
          }
        ],
        filter: [
          {
            term: { real: 0 }
          }
        ]
      }
    }
  })
  const uri = `https://localhost:9200/post/_count`;
  const httpMethod = "POST"
  const responseReal = await elasticService({ body: bodyReal, httpMethod, uri }) as Response;
  const responseFake = await elasticService({ body: bodyFake, httpMethod, uri }) as Response;
  const realResponseData = await responseReal.json()
  const fakeResponseData = await responseFake.json()
  const realCount = realResponseData.count
  const fakeCount = fakeResponseData.count
  if (!realCount || !fakeCount || (realCount + fakeCount === 0)) {
    return Response.json({ verdict: "unknown", odds: 0, real: 0, fake: 0 })
  }
  const verdict = realCount > fakeCount ? "real" : "fake"
  let odds = (Math.max(realCount, fakeCount) / (realCount + fakeCount)) * 100
  // Round to two decimal places
  odds = Math.round(odds * 100) / 100
  return Response.json({ verdict, odds, real: realCount, fake: fakeCount })
}
