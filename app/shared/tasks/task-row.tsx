import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedDate, FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { ShortTaskFragment, ShortUserFragment } from '../../graphql/types';
import { DEFAULT_AVATAR_URL } from '../task/task';
import * as styles from './css/task-row.css';
import * as tasksStyles from './css/tasks.css';

interface IProps {
  task: ShortTaskFragment;
  selected: boolean;
  routeBase: string;
  condensed?: boolean;
}

function renderFollowers(followers: ShortUserFragment[], photo?: boolean) {
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
  const { task, selected, routeBase, condensed } = props;

  const taskClass = classNames(styles.container, {
    [styles.selected]: selected,
    [styles.highPriority]: task.priority === 'high',
    [styles.mediumPriority]: task.priority === 'medium',
    [styles.lowPriority]: task.priority === 'low' || task.priority === null,
    [styles.condensed]: !!condensed,
  });
  const openedAtStyles = classNames(
    tasksStyles.dateSection,
    tasksStyles.openedAt,
    styles.openedAtSection,
  );

  const followers = renderFollowers(task.followers || []);
  const assignedTo = renderAssignedTo(task.assignedTo);
  const formattedCreatedAt = task.createdAt ? (
    <FormattedRelative value={task.createdAt}>
      {(date: string) => <span className={styles.dateValue}>{date}</span>}
    </FormattedRelative>
  ) : null;
  const formattedDueAt = task.dueAt ? (
    <FormattedDate value={task.dueAt} year="numeric" month="short" day="numeric">
      {(date: string) => <span className={styles.dateValue}>{date}</span>}
    </FormattedDate>
  ) : (
    <FormattedMessage id="task.noDueDate">
      {(message: string) => <span className={styles.dateValue}>{message}</span>}
    </FormattedMessage>
  );

  return (
    <Link className={taskClass} to={`${routeBase}/${task.id}`}>
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
