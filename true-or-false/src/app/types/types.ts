export interface CalculationsResult {
  real: number;
  fake: number;
  verdict: "real" | "fake" | "unknown";
  odds: number;
};


export interface ElasticsearchResponse {
  took: number;
  timed_out: boolean;
  _shards: {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
  };
  hits: {
    total: {
      value: number;
      relation: string;
    };
    max_score: number | null;
    hits: Array<{
      _index: string;
      _id: string;
      _score: number | null;
      _ignored?: string[];
      _source: {
        post: number;
        title: string;
        text: string;
        real: number;
      };
      sort?: Array<number>;
    }>;
  };
};

export interface QueryResult {
  _index: string;
  _id: string;
  _score: number | null;
  _ignored?: string[];
  _source: {
    post: number;
    title: string;
    text: string;
    real: number;
  };
}

export interface CompleteAnalysisResponse {
  message?: string;
  atPost: number;
  totalPosts: number;
  progress: number;
  completed: boolean;
  results?: Results;
  partialResults?: PartialResults;
}

export interface PartialResults {
  realTitleWords: string[]
  realTitleWordCounts: number[]
  realTitleLengths: number[]
  realContentSentenceLengths: number[]
  realContentWords: string[]
  realContentWordCounts: number[]
  fakeTitleWords: string[]
  fakeTitleWordCounts: number[]
  fakeTitleLengths: number[]
  fakeContentSentenceLengths: number[]
  fakeContentWords: string[]
  fakeContentWordCounts: number[]
}

export interface Results{
  realTitleWords: {word: string, count: number}[]
  realTitleLengthsAverage: number
  realTitleDistinctNonStopWordsAverage: number
  realContentWords: {word: string, count: number}[]
  realContentSentenceLengthsAverage: number
  realContentDistinctNonStopWordsAverage: number
  fakeTitleWords: {word: string, count: number}[]
  fakeTitleLengthsAverage: number
  fakeTitleDistinctNonStopWordsAverage: number
  fakeContentWords: {word: string, count: number}[]
  fakeContentSentenceLengthsAverage: number
  fakeContentDistinctNonStopWordsAverage: number
}