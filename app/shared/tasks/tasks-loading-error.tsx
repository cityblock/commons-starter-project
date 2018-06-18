import { ApolloError } from 'apollo-client';
import React from 'react';
import Button from '../../shared/library/button/button';
import styles from './css/tasks.css';

interface IProps {
  onRetryClick: () => any;
  loading?: boolean;
  error?: ApolloError | null;
}

export const TasksLoadingError: React.StatelessComponent<IProps> = props => {
  const { error, loading, onRetryClick } = props;

  if (error) {
    return (
      <div className={styles.tasksError}>
        <div className={styles.tasksErrorLabel}>Unable to load active tasks</div>
        <div className={styles.tasksErrorSubheading}>
          Sorry, something went wrong. Please try reloading this section again.
        </div>
        <Button onClick={onRetryClick} label="Try Again" />
      </div>
    );
  } else if (loading) {
    return <div className={styles.tasksLoading}>Loading...</div>;
  }

  return <div />;
};
