import * as React from 'react';
import Icon from '../../shared/library/icon/icon';
import * as styles from './css/risk-areas-loading-error.css';

interface IProps {
  loading?: boolean;
  error?: string | null;
}

export const RiskAreasLoadingError: React.StatelessComponent<IProps> = props => {
  const { error, loading } = props;

  if (error) {
    return (
      <div className={styles.error}>
        <Icon name="event" />
        <div className={styles.errorLabel}>Unable to load risk areas</div>
        <div className={styles.errorSubheading}>
          Sorry, something went wrong. Please try reloading this section again.
        </div>
      </div>
    );
  } else if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return <div />;
};
