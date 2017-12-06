import * as React from 'react';
import { graphql } from 'react-apollo';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import * as taskQuery from '../../graphql/queries/get-task.graphql';
import { FullEventNotificationFragment, FullTaskFragment } from '../../graphql/types';
import * as styles from './css/event-notification-row.css';

interface IProps {
  notification: FullEventNotificationFragment;
  onDismiss: (id: string) => any;
}

interface IGraphqlProps {
  task?: FullTaskFragment;
  taskLoading?: boolean;
  taskError?: string;
}

type allProps = IProps & IGraphqlProps;

class EventNotificationRow extends React.Component<allProps, {}> {
  render() {
    const { notification, onDismiss, task } = this.props;
    const eventLink = task ? `/tasks/${task.id}` : '#';
    const formattedCreatedAt = notification.createdAt ? (
      <FormattedRelative value={notification.createdAt}>
        {(date: string) => <span className={styles.dateValue}>{date}</span>}
      </FormattedRelative>
    ) : null;

    return (
      <div className={styles.container}>
        <Link className={styles.titleLink} to={eventLink}>
          <div className={styles.title}>{notification.title}</div>
        </Link>
        <div className={styles.meta}>
          <div className={styles.dateSection}>{formattedCreatedAt}</div>
          <div className={styles.dismissButton} onClick={() => onDismiss(notification.id)} />
        </div>
      </div>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(taskQuery as any, {
  skip: (props: allProps) => {
    const taskEvent = props.notification.taskEvent;
    return taskEvent && taskEvent.taskId ? false : true;
  },
  options: (props: allProps) => ({
    variables: {
      taskId: props.notification.taskEvent ? props.notification.taskEvent.taskId : null,
    },
  }),
  props: ({ data }) => ({
    taskLoading: data ? data.loading : false,
    taskError: data ? data.error : null,
    task: data ? (data as any).task : null,
    refetchTask: data ? data.refetch : null,
  }),
})(EventNotificationRow);
