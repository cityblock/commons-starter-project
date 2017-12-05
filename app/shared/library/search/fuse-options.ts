export const MAX_PATTERN_LENGTH = 40; // longer pattern makes search slower

const fuseOptions = {
  shouldSort: true, // put results with highest search score first
  keys: ['title'], // search for matches just on title of option, can expand later
  tokenize: true, // search for individual words in addition to entire search string
  matchAllTokens: true, // match all tokens, otherwise difficult to get custom goal add to trigger
  threshold: 0.2, // how fuzzy to search, from 0 (exact match) to 1 (matches anything)
  maxPatternLength: MAX_PATTERN_LENGTH, // algorithm slower with longer pattern
};

export default fuseOptions;
