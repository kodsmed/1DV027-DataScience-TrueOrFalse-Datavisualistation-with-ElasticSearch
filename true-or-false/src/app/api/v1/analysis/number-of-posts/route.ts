import { elasticService } from "@/app/service/elasticSearch";

/**
 * This api function fetches the total number of posts from the Elasticsearch service and returns it
 *
 * route: GET /api/v1/analysis/number-of-posts
 *
 * @returns {Response} - JSON{ message: string, data: { totalPosts: number } }
 */
export async function GET() {
let httpMethod = "GET";
  let uri = "https://localhost:9200/post/_count";

  let body = "";

  let response = await elasticService({ body, httpMethod, uri }) as Response;
  if (!response || !response.ok) {
    return Response.json({ message: "An error occurred: no response", error: "Unknown error" });
  }

  let data = await response.json();
  if (!data || !data.count) {
    return Response.json({ message: "An error occurred: no count", error: "Unknown error" });
  }

  const totalPosts = data.count;
  return Response.json({ message: "Success", data: { totalPosts } });
}