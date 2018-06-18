import classNames from 'classnames';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './css/result.css';
import { formatSearchText } from './helpers';
import { ISearchOption } from './search';

interface IProps {
  searchResult: ISearchOption | null;
  value: string;
  onOptionClick: (optionId: string, optionTitle: string) => void;
  emptyPlaceholderMessageId?: string; // translated text to display if no results found
}

const SearchResult: React.StatelessComponent<IProps> = (props: IProps) => {
  const { searchResult, onOptionClick, emptyPlaceholderMessageId, value } = props;

  if (emptyPlaceholderMessageId) {
    return (
      <FormattedMessage id={emptyPlaceholderMessageId}>
        {(message: string) => <p className={classNames(styles.text, styles.light)}>{message}</p>}
      </FormattedMessage>
    );
  } else if (!searchResult) {
    return null;
  }

  const formattedText = formatSearchText(searchResult.title, value);

  return (
    <p onClick={() => onOptionClick(searchResult.id, searchResult.title)} className={styles.text}>
      {formattedText}
    </p>
  );
};

export default SearchResult;
