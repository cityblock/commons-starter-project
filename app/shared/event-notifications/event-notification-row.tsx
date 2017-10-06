import * as React from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { FullEventNotificationFragment } from '../../graphql/types';
import * as styles from './css/event-notification-row.css';

interface IProps {
  notification: FullEventNotificationFragment;
  onDismiss: (id: string) => any;
}

export class EventNotificationRow extends React.Component<IProps, {}> {
  render() {
    const { notification, onDismiss } = this.props;
    const eventLink = notification.task ? `/tasks/${notification.task.id}` : '#';
    const formattedCreatedAt = notification.createdAt ?
      (<FormattedRelative value={notification.createdAt}>
        {(date: string) => <span className={styles.dateValue}>{date}</span>}
      </FormattedRelative>) : null;

    return (
      <div className={styles.container}>
        <Link className={styles.titleLink} to={eventLink}>
          <div className={styles.title}>{notification.title}</div>
        </Link>
        <div className={styles.meta}>
          <div className={styles.dateSection}>{formattedCreatedAt}</div>
          <div className={styles.dismissButton} onClick={() => onDismiss(notification.id)}></div>
        </div>
      </div>
    );
  }
}
