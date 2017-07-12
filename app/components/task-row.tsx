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

function formatInitials(user: ShortUserFragment) {
  return (user.firstName ? user.firstName[0] : '') + (user.lastName ? user.lastName[0] : '');
}

function renderFollowers(followers: ShortUserFragment[]) {
  return followers.map(user => (
    <div key={user.id} className={styles.follower}>{formatInitials(user)}</div>
  ));
}

export const TaskRow: React.StatelessComponent<IProps> = props => {
  const { task, selected, routeBase } = props;
  const taskClass = classNames(
    styles.container,
    { [styles.selected]: selected },
  );
  const followers = renderFollowers(task.followers || []);
  return (
    <Link
      className={taskClass}
      to={`${routeBase}/${task.id}`}>
      <div className={styles.title}>{task.title}</div>
      <div className={styles.followers}>{followers}</div>
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
