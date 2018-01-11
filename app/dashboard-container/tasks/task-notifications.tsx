import * as React from 'react';
import { graphql } from 'react-apollo';
import * as getEventNotificationsForUserTaskQuery from '../../graphql/queries/get-event-notifications-for-user-task.graphql';
import { ShortEventNotificationsForUserTaskFragment } from '../../graphql/types';
import Spinner from '../../shared/library/spinner/spinner';
import * as styles from './css/task-notifications.css';
import TaskNotification from './task-notification';

interface IProps {
  taskId: string;
}

interface IGraphqlProps {
  loading?: boolean;
  error?: string | null;
  notifications: ShortEventNotificationsForUserTaskFragment[];
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

export default graphql<IGraphqlProps, IProps, allProps>(
  getEventNotificationsForUserTaskQuery as any,
  {
    options: ({ taskId }) => ({
      variables: { taskId },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      notifications: data ? (data as any).eventNotificationsForUserTask : null,
    }),
  },
)(TaskNotifications);
