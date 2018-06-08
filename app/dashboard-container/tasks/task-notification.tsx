import * as React from 'react';
import { FormattedRelative } from 'react-intl';
import { ShortEventNotificationsForUserTaskFragment } from '../../graphql/types';
import Text from '../../shared/library/text/text';
import * as styles from './css/task-notification.css';

interface IProps {
  notification: ShortEventNotificationsForUserTaskFragment;
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
