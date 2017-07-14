import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import * as styles from '../css/components/task-row.css';
import { ShortTaskFragment, ShortUserFragment } from '../graphql/types';

export interface IProps {
  task: ShortTaskFragment;
  selected: boolean;
  routeBase: string;
}

function formatInitials(user: ShortUserFragment, photo?: boolean) {
  return (user.firstName ? user.firstName[0] : '') + (user.lastName ? user.lastName[0] : '');
}

function renderFollowers(followers: ShortUserFragment[], photo?: boolean) {
  const followerCount = followers.length;
  const followersHtmlMap = [];

  if (followerCount) {
    const featuredFollower = followers[0];

    followersHtmlMap.push((
      <div key={featuredFollower.id} className={styles.follower}>
        {formatInitials(featuredFollower)}
      </div>
    ));

    if (followerCount > 1) {
      followersHtmlMap.push((
        <div key={'moreFollowers'} className={styles.follower}>
          {`+${followerCount - 1}`}
        </div>
      ));
    }

    return followersHtmlMap;
  }
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
  const taskClass = classNames(
    styles.container,
    { [styles.selected]: selected },
  );
  const followers = renderFollowers(task.followers || []);
  const assignedTo = task.assignedTo ? renderAssignedTo(task.assignedTo) : null;
  return (
    <Link
      className={taskClass}
      to={`${routeBase}/${task.id}`}>
      <div className={styles.title}>{task.title}</div>
      <div className={styles.followers}>
        {assignedTo}
        {followers}
      </div>
      <div className={styles.dateSection}>
        <FormattedMessage id='task.opened'>
          {(message: string) => <span className={styles.dateLabel}>{message}:</span>}
        </FormattedMessage>
        <span className={styles.dateValue}>{task.createdAt}</span>
      </div>
      <div className={styles.dateSection}>
        <FormattedMessage id='task.due'>
          {(message: string) => <span className={styles.dateLabel}>{message}:</span>}
        </FormattedMessage>
        <span className={styles.dateValue}>{task.dueAt}</span>
      </div>
    </Link>
  );
};
