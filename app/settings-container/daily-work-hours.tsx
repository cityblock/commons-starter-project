import React from 'react';
import { getCurrentUserHoursQuery } from '../graphql/types';
import Text from '../shared/library/text/text';
import styles from './css/daily-work-hours.css';
import DailyWorkHoursDropdown from './daily-work-hours-dropdown';
import DayOffToggle from './day-off-toggle';

interface IProps {
  weekday: number;
  userHours: getCurrentUserHoursQuery['currentUserHours'];
  disabled: boolean;
}

const DailyWorkHours: React.StatelessComponent<IProps> = (props: IProps) => {
  const { userHours, weekday, disabled } = props;

  return (
    <div className={styles.container}>
      <Text
        messageId={`settings.weekday${weekday}`}
        isHeader
        color="black"
        isBold
        className={styles.label}
      />
      <DailyWorkHoursDropdown userHours={userHours} disabled={disabled} />
      <DayOffToggle userHours={userHours} weekday={weekday} disabled={disabled} />
    </div>
  );
};

export default DailyWorkHours;
