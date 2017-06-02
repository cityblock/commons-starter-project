// import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from '../css/components/table-loading-error.css';

interface IProps {
  error?: string;
  isLoading: boolean;
  onRetryClick: () => any;
}

export const TableLoadingError: React.StatelessComponent<IProps> = props => {
  const { error, isLoading } = props;

  if (error) {
    return (
      <div className={styles.errorRow}>
        <div className={styles.errorIcon}></div>
        <div className={styles.errorHeading}>Unable to load your roster</div>
        <div className={styles.errorMessage}>
          Sorry, something went wrong. Please try reloading the page again.
        </div>
        <div className={styles.errorButton} onClick={props.onRetryClick}>Try again</div>
      </div>
    );
  } else if (isLoading) {
    return (
      <div className={styles.loadingRow}>
        <div className={styles.loadingSpinner}></div>
        <div className={styles.loadingText}>Loading</div>
      </div>
    );
  }
  return <div />;
};
