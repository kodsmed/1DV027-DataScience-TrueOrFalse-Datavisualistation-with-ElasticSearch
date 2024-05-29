// Sets the chunk size for the analysis process...
export const sizeLimit = 1000;

// Set stop words for the analysis process, these words will be ignored in the analysis.
export const stopWords = [
  'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'what', 'which',
  'this', 'that', 'these', 'those', 'then', 'he', 'his', 'she', 'her', 'hers', 'it',
  'we', 'them', 'they', 'their', 'who', 'on', 'of', 'at', 'in', 'to', 'are',
  'i', 'you', 'from', 'by', 'be', 'is', 'was', 'for', 'too', '.', ':', ';',
  '!', '?', '(', ')', '[', ']', '{', '}', '"', "'", '“', '”', '‘', '’', '—',
  '–', '…', '-', 's', 'with', 'not', 'have', 'has', 'had', 'will', 'would',
  'should', 'could', 'can', 'may', 'might', 'shall', 'must', 'do', 'does',
  'did', 'done', 'doing', 'am', 'were', 'been', 'being', 'having'
];