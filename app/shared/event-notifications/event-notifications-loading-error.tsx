import * as React from 'react';
import * as styles from './css/event-notifications.css';

interface IProps {
  onRetryClick: () => any;
  loading?: boolean;
  error?: string;
}

export const EventNotificationsLoadingError: React.StatelessComponent<IProps> = props => {
  const { error, loading, onRetryClick } = props;

  if (error) {
    return (
      <div className={styles.eventNotificationsError}>
        <div className={styles.eventNotificationsErrorIcon}></div>
        <div className={styles.eventNotificationsErrorLabel}>Unable to load notifications</div>
        <div className={styles.eventNotificationsErrorSubheading}>
          Sorry, something went wrong. Please try reloading this section again.
        </div>
        <div className={styles.eventNotificationsErrorButton} onClick={onRetryClick}>Try again</div>
      </div>
    );
  } else if (loading) {
    return <div className={styles.eventNotificationsLoading}>Loading...</div>;
  }

  return <div />;
};
