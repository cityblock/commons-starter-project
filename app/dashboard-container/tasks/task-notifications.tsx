import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import getEventNotificationsForUserTask from '../../graphql/queries/get-event-notifications-for-user-task.graphql';
import { ShortEventNotificationsForUserTask } from '../../graphql/types';
import Spinner from '../../shared/library/spinner/spinner';
import styles from './css/task-notifications.css';
import TaskNotification from './task-notification';

interface IProps {
  taskId: string;
}

interface IGraphqlProps {
  loading: boolean;
  error: ApolloError | null | undefined;
  notifications: ShortEventNotificationsForUserTask[];
}

type allProps = IProps & IGraphqlProps;

export const TaskNotifications: React.StatelessComponent<allProps> = (props: allProps) => {
  const { loading, error, notifications } = props;
  if (loading || error) return <Spinner />;

  const renderedNotifications = notifications.map(notification => (
    <TaskNotification key={notification.id} notification={notification} />
  ));

  return <div className={styles.container}>{renderedNotifications}</div>;
};

export default graphql(getEventNotificationsForUserTask, {
  options: ({ taskId }: IProps) => ({
    variables: { taskId },
    fetchPolicy: 'network-only',
  }),
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    notifications: data ? (data as any).eventNotificationsForUserTask : null,
  }),
})(TaskNotifications);
