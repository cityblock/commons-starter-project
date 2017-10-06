import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import * as styles from './css/table-loading-error.css';

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
        <FormattedMessage id='error.tableLoadingHeading'>
          {(message: string) =>
            <div className={styles.errorHeading}>{message}</div>}
        </FormattedMessage>3
        <FormattedMessage id='error.tableLoadingMessage'>
          {(message: string) =>
            <div className={styles.errorMessage}>{message}</div>}
        </FormattedMessage>
        <FormattedMessage id='error.tableLoadingButton'>
          {(message: string) =>
            <div className={styles.errorButton} onClick={props.onRetryClick}>{message}</div>}
        </FormattedMessage>
      </div>
    );
  } else if (isLoading) {
    return (
      <div className={styles.loadingRow}>
        <div className={loadingStyles.loadingSpinner}></div>
        <FormattedMessage id='error.tableLoading'>
          {(message: string) =>
            <div className={loadingStyles.loadingText}>{message}</div>}
        </FormattedMessage>
      </div>
    );
  }
  return <div />;
};
