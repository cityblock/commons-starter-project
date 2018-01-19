import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedDate, FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { ShortTaskFragment, ShortUserFragment } from '../../graphql/types';
import { checkIfDueSoon } from '../../shared/util/due-date';
import { DEFAULT_AVATAR_URL } from '../task/task';
import * as styles from './css/task-row.css';
import * as tasksStyles from './css/tasks.css';

interface IProps {
  task: ShortTaskFragment;
  selectedTaskId: string;
  routeBase: string;
  condensed?: boolean;
  taskIdsWithNotifications?: string[];
}

function renderFollowers(followers: ShortUserFragment[]) {
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

function renderAssignedTo(user: ShortUserFragment | null) {
  let displayAvatarUrl: string = DEFAULT_AVATAR_URL;

  if (user) {
    displayAvatarUrl = user.googleProfileImageUrl || DEFAULT_AVATAR_URL;
  }

  return (
    <div className={styles.assignedTo} style={{ backgroundImage: `url(${displayAvatarUrl})` }} />
  );
}

export const TaskRow: React.StatelessComponent<IProps> = (props: IProps) => {
  const { task, selectedTaskId, routeBase, condensed, taskIdsWithNotifications } = props;
  const dueSoon = checkIfDueSoon(task.dueAt);
  const hasNotification = !!taskIdsWithNotifications && taskIdsWithNotifications.includes(task.id);

  const taskClass = classNames(styles.container, {
    [styles.selected]: !!selectedTaskId && selectedTaskId === task.id,
    [styles.highPriority]: task.priority === 'high',
    [styles.mediumPriority]: task.priority === 'medium',
    [styles.lowPriority]: task.priority === 'low' || task.priority === null,
    [styles.condensed]: !!condensed,
    [styles.inactive]: !!selectedTaskId && selectedTaskId !== task.id,
    [styles.compressed]: !!selectedTaskId,
    [styles.notificationBadge]: dueSoon || hasNotification,
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
  const assignedTo = renderAssignedTo(task.assignedTo);
  const formattedCreatedAt = task.createdAt ? (
    <FormattedRelative value={task.createdAt}>
      {(date: string) => <span className={styles.dateValue}>{date}</span>}
    </FormattedRelative>
  ) : null;
  const formattedDueAt = task.dueAt ? (
    <FormattedDate value={task.dueAt} year="numeric" month="short" day="numeric">
      {(date: string) => <span className={dueDateStyles}>{date}</span>}
    </FormattedDate>
  ) : (
    <FormattedMessage id="task.noDueDate">
      {(message: string) => <span className={styles.dateValue}>{message}</span>}
    </FormattedMessage>
  );

  // Note: onClick to stop propagation because otherwise would close task pane
  return (
    <Link className={taskClass} to={`${routeBase}/${task.id}`} onClick={e => e.stopPropagation()}>
      <div className={styles.title}>{task.title}</div>
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
