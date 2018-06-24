import classNames from 'classnames';
import { format } from 'date-fns';
import { get } from 'lodash';
import React from 'react';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { Gender, ShortTask, ShortUser } from '../../graphql/types';
import { formatFullName, isDueSoon } from '../helpers/format-helpers';
import Avatar from '../library/avatar/avatar';
import PatientPhoto from '../library/patient-photo/patient-photo';
import Text from '../library/text/text';
import { isCBOReferralRequiringActionForUser } from '../task/helpers/helpers';
import styles from './css/task-row.css';
import tasksStyles from './css/tasks.css';

interface ITask extends ShortTask {
  patient?: {
    id: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    patientInfo: {
      gender: Gender | null;
      hasUploadedPhoto: boolean | null;
    };
  };
}

interface IProps {
  task: ITask;
  selectedTaskId: string;
  routeBase: string;
  condensed?: boolean;
  taskIdsWithNotifications?: string[];
  currentUserId: string;
}

function renderFollowers(followers: ShortUser[]) {
  const followerCount = followers.length;
  const followersHtmlMap = [];

  if (followerCount) {
    followersHtmlMap.push(
      <div key={'moreFollowers'} className={styles.follower}>
        {`+${followerCount}`}
      </div>,
    );
  }

  return followersHtmlMap;
}

function renderAssignedTo(user: ShortUser | null) {
  return <Avatar src={user ? user.googleProfileImageUrl : null} size="small" />;
}

export const TaskRow: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    task,
    selectedTaskId,
    routeBase,
    condensed,
    taskIdsWithNotifications,
    currentUserId,
  } = props;
  const dueSoon = isDueSoon(task.dueAt);
  const dueSoonForUser = dueSoon && task.assignedToId === currentUserId;
  const isCBOReferralRequiringAction = isCBOReferralRequiringActionForUser(task, currentUserId);
  const hasNotification = !!taskIdsWithNotifications && taskIdsWithNotifications.includes(task.id);

  const taskClass = classNames(styles.container, {
    [styles.selected]: !!selectedTaskId && selectedTaskId === task.id,
    [styles.highPriority]: task.priority === 'high',
    [styles.mediumPriority]: task.priority === 'medium',
    [styles.lowPriority]: task.priority === 'low' || task.priority === null,
    [styles.condensed]: !!condensed,
    [styles.inactive]: !!selectedTaskId && selectedTaskId !== task.id,
    [styles.compressed]: !!selectedTaskId,
    [styles.notificationBadge]: dueSoonForUser || hasNotification || isCBOReferralRequiringAction,
  });

  const openedAtStyles = classNames(
    tasksStyles.dateSection,
    tasksStyles.openedAt,
    styles.openedAtSection,
  );

  const dueDateStyles = classNames(styles.dateValue, {
    [styles.highlightRed]: dueSoon,
  });

  const followers = renderFollowers(task.followers || []);
  const assignedTo = condensed ? renderAssignedTo(task.assignedTo) : null;
  const formattedCreatedAt = task.createdAt ? (
    <FormattedRelative value={task.createdAt}>
      {(date: string) => <span className={styles.dateValue}>{date}</span>}
    </FormattedRelative>
  ) : null;
  const formattedDueAt = task.dueAt ? (
    <span className={dueDateStyles}>{format(task.dueAt, 'MMM D, YYYY')}</span>
  ) : (
    <FormattedMessage id="task.noDueDate">
      {(message: string) => <span className={styles.dateValue}>{message}</span>}
    </FormattedMessage>
  );

  const patientImageHtml = !condensed ? (
    <PatientPhoto
      patientId={task.patientId}
      gender={get(task, 'patient.patientInfo.gender')}
      hasUploadedPhoto={!!get(task, 'patient.patientInfo.hasUploadedPhoto')}
      type="circle"
      className={styles.patientImage}
    />
  ) : null;
  const patientName = task.patient
    ? formatFullName(task.patient.firstName, task.patient.lastName)
    : '';
  const patientNameHtml = !condensed ? (
    <Text text={patientName} color="gray" className={styles.patientName} />
  ) : null;

  const querystring = window.location.search.substring(1);
  const linkTo = `${routeBase}/${task.id}?${querystring}`;

  // Note: onClick to stop propagation because otherwise would close task pane
  return (
    <Link className={taskClass} to={linkTo} onClick={e => e.stopPropagation()}>
      <div className={styles.flexRow}>
        {patientImageHtml}
        <div>
          {patientNameHtml}
          <div className={styles.title}>{task.title}</div>
        </div>
      </div>
      <div className={styles.meta}>
        <div className={styles.followers}>
          {assignedTo}
          {followers}
        </div>
        <div className={openedAtStyles}>
          <FormattedMessage id="task.opened">
            {(message: string) => <span className={styles.dateLabel}>{message}:</span>}
          </FormattedMessage>
          {formattedCreatedAt}
        </div>
        <div className={tasksStyles.dateSection}>
          <FormattedMessage id="task.due">
            {(message: string) => <span className={styles.dateLabel}>{message}:</span>}
          </FormattedMessage>
          {formattedDueAt}
        </div>
      </div>
    </Link>
  );
};

export default TaskRow;
