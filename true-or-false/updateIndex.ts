import {
  fetch,
  setGlobalDispatcher,
  Agent,
} from 'undici'

async function elasticService({ body, method, uri }: { body: string, method: string, uri: string }) {

  try {
    setGlobalDispatcher(new Agent({
      connect: {
        rejectUnauthorized: false
      }
    }))

    const response = await fetch(uri, {
      method: method,
      headers: new Headers({
        'Authorization': 'Basic ' + btoa(`elastic:${process.env.ELASTIC_PASSWORD}`), // Username and password for Basic Auth
        'Content-Type': 'application/json',
      }),
      body: body
    });

    if (!response.ok) {
      console.log('response: ' + await response.text());
      return Response.json({ message: "An error occurred", error: "Unknown error" });
    }
    console.log('response: ' + await response.text());
    return response;
  } catch (error) {
    return {};
  }
}

async function updateIndex() {
  const bodyForAnalyser = JSON.stringify({
    "settings": {
      "analysis": {
        "analyzer": {
          "custom_text_analyzer": {
            "type": "custom",
            "tokenizer": "whitespace",
            "filter": ["lowercase", "english_stop"]
          }
        },
        "filter": {
          "english_stop": {
            "type": "stop",
            "stopwords": "_english_"
          }
        }
      }
    }
  });

  const bodyForMapping = JSON.stringify({
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "custom_text_analyzer",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "text": {
        "type": "text",
        "analyzer": "custom_text_analyzer",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      }
    }
  })
  const bodyForReIndexing = JSON.stringify({
    "source": {
      "index": "old_index"
    },
    "dest": {
      "index": "your_index"
    },
    "script": {
      "source": "ctx._source.title = ctx._source.title"
    }
  })
}

updateIndex()