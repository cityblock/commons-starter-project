import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../shared/library/icon/icon';
import * as styles from './css/helpers.css';

interface ITitleProps {
  query: string | null;
}

export const PatientSearchTitle: React.StatelessComponent<ITitleProps> = ({ query }) => {
  if (query) {
    return (
      <div className={styles.title}>
        <FormattedMessage id="patientSearch.resultsTitle">
          {(message: string) => <h2>{message}</h2>}
        </FormattedMessage>
        <h2 className={styles.lightBlue}>{query}</h2>
      </div>
    );
  }

  return (
    <div className={styles.title}>
      <FormattedMessage id="patientSearch.searchTitle">
        {(message: string) => <h2>{message}</h2>}
      </FormattedMessage>
    </div>
  );
};

interface IDescriptionProps {
  totalResults: number | null;
}

export const PatientSearchDescription: React.StatelessComponent<IDescriptionProps> = ({
  totalResults,
}) => {
  if (totalResults !== null) {
    const messageId =
      totalResults === 1
        ? 'patientSearch.resultsDescriptionSingle'
        : 'patientSearch.resultsDescription';

    return (
      <FormattedMessage id={messageId}>
        {(message: string) => (
          <p className={styles.description}>
            {totalResults} {message}
          </p>
        )}
      </FormattedMessage>
    );
  }

  return (
    <FormattedMessage id="patientSearch.searchDescription">
      {(message: string) => <p className={styles.description}>{message}</p>}
    </FormattedMessage>
  );
};

interface IResultsColumnHeaderProps {
  messageId: string;
  className?: string;
}

export const PatientSearchResultsColumnHeader: React.StatelessComponent<
  IResultsColumnHeaderProps
> = ({ messageId, className }) => {
  const columnHeaderStyles = classNames(styles.columnHeader, className);
  return (
    <FormattedMessage id={messageId}>
      {(message: string) => <h3 className={columnHeaderStyles}>{message}</h3>}
    </FormattedMessage>
  );
};

export const PatientSearchResultsPlaceholder: React.StatelessComponent<{}> = () => (
  <div className={styles.placeholder}>
    <Icon name="search" className={styles.searchIcon} />
    <FormattedMessage id="patientSearch.resultsPlaceholder">
      {(message: string) => <h4 className={styles.searchText}>{message}</h4>}
    </FormattedMessage>
  </div>
);

export const PatientSearchNoResults: React.StatelessComponent<{}> = () => (
  <div className={styles.placeholder}>
    <Icon name="errorOutline" className={styles.noResultsIcon} />
    <FormattedMessage id="patientSearch.noResults">
      {(message: string) => <h4 className={styles.noResults}>{message}</h4>}
    </FormattedMessage>
    <FormattedMessage id="patientSearch.noResultsDetail">
      {(message: string) => <p className={styles.noResultsDetail}>{message}</p>}
    </FormattedMessage>
  </div>
);
