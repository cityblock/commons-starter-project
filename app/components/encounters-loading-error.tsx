import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from '../css/components/patient-encounters.css';

interface IProps {
  onRetryClick: () => any;
  loading?: boolean;
  error?: string;
}

const buttonStyles = classNames(styles.invertedButton, styles.encountersErrorButton);

export const EncountersLoadingError: React.StatelessComponent<IProps> = props => {
  const { error, loading, onRetryClick } = props;

  if (error) {
    return (
      <div className={styles.encountersError}>
        <div className={styles.encountersErrorIcon}></div>
        <div className={styles.encountersErrorLabel}>Unable to load encounter history</div>
        <div className={styles.encountersErrorSubheading}>
          Sorry, something went wrong. Please try reloading this section again.
        </div>
        <div className={buttonStyles} onClick={onRetryClick}>Try again</div>
      </div>
    );
  } else if (loading) {
    return <div className={styles.encountersLoading}>Loading...</div>;
  }

  return <div />;
};
