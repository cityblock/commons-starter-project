import * as React from 'react';
import * as styles from '../css/components/table-loading-error.css';
import * as loadingStyles from '../css/shared/loading-spinner.css';

export interface IProps {
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
        <div className={loadingStyles.loadingSpinner}></div>
        <div className={loadingStyles.loadingText}>Loading</div>
      </div>
    );
  }
  return <div />;
};
