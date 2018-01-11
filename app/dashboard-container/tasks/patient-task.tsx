import * as classNames from 'classnames';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { ShortUrgentTaskForPatientFragment } from '../../graphql/types';
import { getMapTaskRoute } from '../../shared/helpers/route-helpers';
import Avatar from '../../shared/library/avatar/avatar';
import DateInfo from '../../shared/library/date-info/date-info';
import * as styles from './css/patient-task.css';
import TaskNotifications from './task-notifications';

interface IProps {
  task: ShortUrgentTaskForPatientFragment;
  withNotifications: boolean;
}

const PatientTask: React.StatelessComponent<IProps> = (props: IProps) => {
  const { task, withNotifications } = props;
  const taskLink = getMapTaskRoute(task.patientId, task.id);

  const linkStyles = classNames(styles.link, {
    [styles.redBorder]: task.priority && task.priority === 'high',
    [styles.yellowBorder]: task.priority && task.priority === 'medium',
    [styles.grayBorder]: task.priority && task.priority === 'low',
  });
  const renderedFollowers = task.followers.map(follower => (
    <Avatar
      key={follower.id}
      src={follower.googleProfileImageUrl}
      size="small"
      className={styles.avatar}
    />
  ));

  return (
    <Link to={taskLink} className={linkStyles}>
      <div className={styles.container}>
        <h2>{task.title}</h2>
        <div className={styles.info}>
          <div className={styles.followers}>{renderedFollowers}</div>
          <DateInfo date={task.dueAt} label="due" units="day" highlightDueSoon={true} />
        </div>
      </div>
      {withNotifications && <TaskNotifications taskId={task.id} />}
    </Link>
  );
};

export default PatientTask;
