import React from 'react';
import { FormattedRelative } from 'react-intl';
import { ShortEventNotificationsForUserTask } from '../../graphql/types';
import Text from '../../shared/library/text/text';
import styles from './css/task-notification.css';

interface IProps {
  notification: ShortEventNotificationsForUserTask;
}

const TaskNotification: React.StatelessComponent<IProps> = (props: IProps) => {
  const { notification } = props;

  return (
    <div className={styles.container}>
      <h5>{notification.title}</h5>
      <FormattedRelative value={notification.createdAt}>
        {(formattedDate: string) => <Text text={formattedDate} />}
      </FormattedRelative>
    </div>
  );
};

export default TaskNotification;
