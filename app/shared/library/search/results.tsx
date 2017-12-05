import * as React from 'react';
import * as styles from './css/results.css';
import SearchResult from './result';
import { SearchOptions } from './search';

interface IProps {
  searchResults: SearchOptions;
  value: string; // for formatting purposes to highlight text
  hideResults: boolean;
  onOptionClick: (optionId: string) => void;
  showAll?: boolean;
  emptyPlaceholderMessageId?: string; // translated text to display if no results found
}

const SearchResults: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    searchResults,
    value,
    hideResults,
    onOptionClick,
    showAll,
    emptyPlaceholderMessageId,
  } = props;

  if (!searchResults || (hideResults && !showAll)) return null;

  const results = searchResults.length ? (
    searchResults.map((result, i) => (
      <SearchResult key={i} searchResult={result} value={value} onOptionClick={onOptionClick} />
    ))
  ) : (
    <SearchResult
      searchResult={null}
      value={value}
      emptyPlaceholderMessageId={emptyPlaceholderMessageId}
      onOptionClick={onOptionClick}
    />
  );

  return <div className={styles.container}>{results}</div>;
};

export default SearchResults;
