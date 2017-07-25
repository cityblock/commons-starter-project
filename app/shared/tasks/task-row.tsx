import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedDate, FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { FullTaskFragment, ShortUserFragment } from '../../graphql/types';
import * as styles from './css/task-row.css';
import * as tasksStyles from './css/tasks.css';

export interface IProps {
  task: FullTaskFragment;
  selected: boolean;
  routeBase: string;
}

function renderFollowers(followers: ShortUserFragment[], photo?: boolean) {
  const followerCount = followers.length;
  const followersHtmlMap = [];

  if (followerCount) {
    followersHtmlMap.push((
      <div key={'moreFollowers'} className={styles.follower}>
        {`+${followerCount}`}
      </div>
    ));
  }

  return followersHtmlMap;
}

function renderAssignedTo(user: ShortUserFragment) {
  return (
    <div
      className={styles.assignedTo}
      style={{ backgroundImage: `url(${user.googleProfileImageUrl})` }} />
  );
}

export const TaskRow: React.StatelessComponent<IProps> = props => {
  const { task, selected, routeBase } = props;
  const taskClass = classNames(styles.container, {
    [styles.selected]: selected,
    [styles.highPriority]: task.priority === 'high',
    [styles.mediumPriority]: task.priority === 'medium',
    [styles.lowPriority]: task.priority === 'low' || task.priority === null,
  });
  const followers = renderFollowers(task.followers || []);
  const assignedTo = task.assignedTo ? renderAssignedTo(task.assignedTo) : null;
  const formattedCreatedAt = task.createdAt ?
    (<FormattedRelative value={task.createdAt}>
      {(date: string) => <span className={styles.dateValue}>{date}</span>}
    </FormattedRelative>) : null;
  const formattedDueAt = task.dueAt ?
    (<FormattedDate value={task.dueAt} year='numeric' month='short' day='numeric'>
      {(date: string) => <span className={styles.dateValue}>{date}</span>}
    </FormattedDate>) : null;
  return (
    <Link className={taskClass} to={`${routeBase}/${task.id}`}>
      <div className={styles.title}>{task.title}</div>
      <div className={styles.meta}>
        <div className={styles.followers}>
          {assignedTo}
          {followers}
        </div>
        <div className={classNames(tasksStyles.dateSection, tasksStyles.openedAt)}>
          <FormattedMessage id='task.opened'>
            {(message: string) => <span className={styles.dateLabel}>{message}:</span>}
          </FormattedMessage>
          {formattedCreatedAt}
        </div>
        <div className={classNames(styles.dateSection, styles.dueAtSection)}>
          <FormattedMessage id='task.due'>
            {(message: string) => <span className={styles.dateLabel}>{message}:</span>}
          </FormattedMessage>
          {formattedDueAt}
        </div>
      </div>
    </Link>
  );
};
