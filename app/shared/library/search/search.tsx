import Fuse = require('fuse.js');
import * as React from 'react';
import fuseOptions, { MAX_PATTERN_LENGTH } from './fuse-options';
import SearchInput from './input';
import SearchResults from './results';

export interface ISearchOption {
  title: string; // text to display for the option
  id: string; // underlying id of option
}

export type SearchOptions = ISearchOption[];

interface IProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchOptions: SearchOptions;
  onOptionClick: (optionId: string) => void; // what to do if user clicks on search option
  hideResults?: boolean; // hide dropdown menu
  showAll?: boolean; // simply render all search options
  placeholderMessageId?: string; // optional placeholderMessageId text for empty field
  emptyPlaceholderMessageId?: string; // optional placeholder message id if no results found
}

interface IState {
  searchResults: SearchOptions;
  fuse?: Fuse;
}

class Search extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { searchResults: [] };
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (!this.props.searchOptions.length && nextProps.searchOptions.length) {
      this.setFuse(nextProps.searchOptions);
    }

    if (this.props.value !== nextProps.value) {
      if (!this.state.fuse) {
        this.setFuse(nextProps.searchOptions, () => this.search(nextProps.value));
      } else {
        this.search(nextProps.value);
      }
    }
  }

  setFuse(searchOptions: SearchOptions, callback?: () => void): void {
    const fuse = new Fuse(searchOptions, fuseOptions);
    this.setState({ fuse });
  }

  search(value: string): void {
    if (!this.state.fuse || value.length > MAX_PATTERN_LENGTH) return;
    const searchResults = this.state.fuse.search(value) as SearchOptions;
    this.setState({ searchResults });
  }

  formatSearchResults(): SearchOptions {
    const { showAll, searchOptions } = this.props;
    return showAll ? searchOptions : this.state.searchResults;
  }

  render(): JSX.Element {
    const {
      value,
      onChange,
      placeholderMessageId,
      showAll,
      onOptionClick,
      hideResults,
      emptyPlaceholderMessageId,
    } = this.props;

    return (
      <div>
        <SearchInput
          value={value}
          onChange={onChange}
          placeholderMessageId={placeholderMessageId}
        />
        <SearchResults
          searchResults={this.formatSearchResults()}
          value={value}
          hideResults={!value || !!hideResults}
          onOptionClick={onOptionClick}
          showAll={!!showAll}
          emptyPlaceholderMessageId={emptyPlaceholderMessageId}
        />
      </div>
    );
  }
}

export default Search;
