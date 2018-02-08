import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/table-loading-error.css';

interface IProps {
  onRetryClick: () => any;
}

export const TableLoadingError: React.StatelessComponent<IProps> = props => {
  return (
    <div className={styles.errorRow}>
      <div className={styles.errorIcon} />
      <FormattedMessage id="error.tableLoadingHeading">
        {(message: string) => <div className={styles.errorHeading}>{message}</div>}
      </FormattedMessage>3
      <FormattedMessage id="error.tableLoadingMessage">
        {(message: string) => <div className={styles.errorMessage}>{message}</div>}
      </FormattedMessage>
      <FormattedMessage id="error.tableLoadingButton">
        {(message: string) => (
          <div className={styles.errorButton} onClick={props.onRetryClick}>
            {message}
          </div>
        )}
      </FormattedMessage>
    </div>
  );
};
