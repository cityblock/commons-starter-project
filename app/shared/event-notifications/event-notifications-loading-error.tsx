import * as React from 'react';
import Button from '../../shared/library/button/button';
import * as styles from './css/event-notifications.css';

interface IProps {
  onRetryClick: () => any;
  loading?: boolean;
  error: string | null;
}

export const EventNotificationsLoadingError: React.StatelessComponent<IProps> = props => {
  const { error, loading, onRetryClick } = props;

  if (error) {
    return (
      <div className={styles.eventNotificationsError}>
        <div className={styles.eventNotificationsErrorLabel}>Unable to load notifications</div>
        <div className={styles.eventNotificationsErrorSubheading}>
          Sorry, something went wrong. Please try reloading this section again.
        </div>
        <Button onClick={onRetryClick} label="Try again" />
      </div>
    );
  } else if (loading) {
    return <div className={styles.eventNotificationsLoading}>Loading...</div>;
  }

  return <div />;
};
