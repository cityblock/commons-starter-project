import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/helper-components.css';

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
