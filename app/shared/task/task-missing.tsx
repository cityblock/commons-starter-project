import React from 'react';
import Button from '../library/button/button';
import styles from './css/task.css';

interface IProps {
  taskLoading?: boolean;
  taskError: string | null;
  reloadTask: () => void;
}

export const TaskMissing: React.StatelessComponent<IProps> = props => {
  const { taskLoading, taskError, reloadTask } = props;

  if (taskLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  } else if (!!taskError) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingError}>
          <div className={styles.loadingErrorLabel}>Unable to load task</div>
          <div className={styles.loadingErrorSubheading}>
            Sorry, something went wrong. Please try again.
          </div>
          <Button color="white" onClick={reloadTask} label="Try again" />
        </div>
      </div>
    );
  } else {
    return <div className={styles.container} />;
  }
};
