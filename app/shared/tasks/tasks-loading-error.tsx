import * as React from 'react';
import * as styles from './css/tasks.css';

export interface IProps {
  onRetryClick: () => any;
  loading?: boolean;
  error?: string;
}

export const TasksLoadingError: React.StatelessComponent<IProps> = props => {
  const { error, loading, onRetryClick } = props;

  if (error) {
    return (
      <div className={styles.tasksError}>
        <div className={styles.tasksErrorIcon}></div>
        <div className={styles.tasksErrorLabel}>Unable to load active tasks</div>
        <div className={styles.tasksErrorSubheading}>
          Sorry, something went wrong. Please try reloading this section again.
        </div>
        <div className={styles.tasksErrorButton} onClick={onRetryClick}>Try again</div>
      </div>
    );
  } else if (loading) {
    return <div className={styles.tasksLoading}>Loading...</div>;
  }

  return <div />;
};
