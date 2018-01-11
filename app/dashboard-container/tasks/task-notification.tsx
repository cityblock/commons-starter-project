import * as React from 'react';
import { FormattedRelative } from 'react-intl';
import { ShortEventNotificationsForUserTaskFragment } from '../../graphql/types';
import SmallText from '../../shared/library/small-text/small-text';
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
        {(formattedDate: string) => <SmallText text={formattedDate} />}
      </FormattedRelative>
    </div>
  );
};

export default TaskNotification;
