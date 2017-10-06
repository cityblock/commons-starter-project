import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './css/task.css';

interface IProps {
  taskLoading?: boolean;
  taskError?: string;
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
          <div className={styles.loadingErrorIcon} />
          <div className={styles.loadingErrorLabel}>Unable to load task</div>
          <div className={styles.loadingErrorSubheading}>
            Sorry, something went wrong. Please try again.
          </div>
          <div
            className={classNames(styles.loadingErrorButton, styles.invertedButton)}
            onClick={reloadTask}
          >
            Try again
          </div>
        </div>
      </div>
    );
  } else {
    return <div className={styles.container} />;
  }
};
