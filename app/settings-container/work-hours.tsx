import classNames from 'classnames';
import React from 'react';
import { getCurrentUserHours } from '../graphql/types';
import styles from './css/work-hours.css';
import DailyWorkHours from './daily-work-hours';

const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

interface IProps {
  currentUserHours: getCurrentUserHours['currentUserHours'];
  disabled: boolean;
}

const WorkHours: React.StatelessComponent<IProps> = (props: IProps) => {
  const { currentUserHours, disabled } = props;
  const allWorkHours: JSX.Element[] = [];

  WEEKDAY_ORDER.forEach(weekday => {
    const dailyHours = currentUserHours.filter(userHours => userHours.weekday === weekday);

    allWorkHours.push(
      <DailyWorkHours key={weekday} weekday={weekday} userHours={dailyHours} disabled={disabled} />,
    );
  });

  const containerStyles = classNames(styles.container, {
    [styles.opaque]: disabled,
  });

  return <div className={containerStyles}>{allWorkHours}</div>;
};

export default WorkHours;
