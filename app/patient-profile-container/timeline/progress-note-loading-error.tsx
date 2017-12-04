import * as React from 'react';
import * as styles from './css/patient-timeline.css';

interface IProps {
  loading?: boolean;
  error?: string;
}

export const ProgressNoteLoadingError: React.StatelessComponent<IProps> = props => {
  const { error, loading } = props;

  if (error) {
    return (
      <div className={styles.error}>
        <div className={styles.errorIcon} />
        <div className={styles.errorLabel}>Unable to load</div>
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
