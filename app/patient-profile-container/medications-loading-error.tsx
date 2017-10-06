import * as React from 'react';
import * as styles from './css/patient-medications.css';

interface IProps {
  onRetryClick: () => any;
  loading?: boolean;
  error?: string;
}

export const MedicationsLoadingError: React.StatelessComponent<IProps> = props => {
  const { error, loading, onRetryClick } = props;

  if (error) {
    return (
      <div className={styles.medicationsError}>
        <div className={styles.medicationsErrorIcon}></div>
        <div className={styles.medicationsErrorLabel}>Unable to load active medications</div>
        <div className={styles.medicationsErrorSubheading}>
          Sorry, something went wrong. Please try reloading this section again.
        </div>
        <div className={styles.medicationsErrorButton} onClick={onRetryClick}>Try again</div>
      </div>
    );
  } else if (loading) {
    return <div className={styles.medicationsLoading}>Loading...</div>;
  }

  return <div />;
};
