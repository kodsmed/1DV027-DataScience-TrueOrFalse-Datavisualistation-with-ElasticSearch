import {
  fetch,
  setGlobalDispatcher,
  Agent,
} from 'undici'


/**
 * Function to call the elastic search server
 * It will call the elastic search server and return the response for further processing
 *
 * @param {string} body - The body of the request
 * @param {string} httpMethod - The http method to use
 * @param {string} uri - The uri to call
 * @returns {Response}
 */
export async function elasticService({ body, httpMethod, uri }: { body: string, httpMethod: string, uri: string }) {

  try {
    // Check if the host is localhost, if so set the global dispatcher to ignore the issues of self signed certificates
    // We are communicating with the elastic search server, which uses a self signed certificate.
    // And its localhost to localhost communication, so we can ignore the certificate issues.
    const host = uri.split('/')[2];
    console.log('host: ' + host)
    if (host === 'localhost:9200') {
      console.log('Setting global dispatcher');
      setGlobalDispatcher(new Agent({
        connect: {
          rejectUnauthorized: false
        }
      }))
    }

    // Call the elastic search server with the given parameters
    let response;
    if (httpMethod !== 'GET') {
      response = await fetch(uri, {
        method: httpMethod,
        headers: new Headers({
          'Authorization': 'Basic ' + btoa(`elastic:${process.env.ELASTIC_PASSWORD}`), // Username and password for Basic Auth
          'Content-Type': 'application/json',
        }),
        body: body
      });
    } else {
      response = await fetch(uri, {
        method: httpMethod,
        headers: new Headers({
          'Authorization': 'Basic ' + btoa(`elastic:${process.env.ELASTIC_PASSWORD}`), // Username and password for Basic Auth
          'Content-Type': 'application/json',
        }),
      });
    }

    if (!response.ok) {
      console.log('response: ' + await response.text());
      return Response.json({ message: "An error occurred", error: "Unknown error" });
    }
    return response;
  } catch (error) {
    return {};
  }
}