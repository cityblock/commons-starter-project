import classNames from 'classnames';
import React from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import styles from './css/concern-stats.css';

interface IProps {
  goalCount: number;
  taskCount: number;
  createdAt: string;
  lastUpdated: string;
  inactive: boolean;
}

interface IStatLabelProps {
  messageId: string;
  small?: boolean;
}

export const StatLabel: React.StatelessComponent<IStatLabelProps> = ({ messageId, small }) => {
  const labelStyles = classNames(styles.label, {
    [styles.small]: !!small,
  });

  return (
    <FormattedMessage id={messageId}>
      {(message: string) => <h4 className={labelStyles}>{message}</h4>}
    </FormattedMessage>
  );
};

export const StatDate: React.StatelessComponent<{ date: string }> = ({ date }) => (
  <div className={styles.date}>
    <FormattedDate value={date} year="numeric" month="short" day="numeric" />
  </div>
);

const ConcernStats: React.StatelessComponent<IProps> = (props: IProps) => {
  const { goalCount, taskCount, createdAt, lastUpdated, inactive } = props;
  const groupStyles = classNames(styles.group, {
    [styles.inactive]: inactive,
  });

  return (
    <div className={styles.container}>
      <div className={groupStyles}>
        <div className={styles.stat}>
          <StatLabel messageId="concernStats.goals" />
          <h5>{goalCount}</h5>
        </div>
        <div className={styles.stat}>
          <StatLabel messageId="concernStats.tasks" />
          <h5>{taskCount}</h5>
        </div>
      </div>
      <div className={groupStyles}>
        <div className={styles.stat}>
          <StatLabel messageId="concernStats.created" small={true} />
          <StatDate date={createdAt} />
        </div>
        <div className={styles.stat}>
          <StatLabel messageId="concernStats.lastUpdated" small={true} />
          <StatDate date={lastUpdated} />
        </div>
      </div>
    </div>
  );
};

export default ConcernStats;
