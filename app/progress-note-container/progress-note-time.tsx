import { addMinutes, format } from 'date-fns';
import * as React from 'react';
import FormLabel from '../shared/library/form-label/form-label';
import Select from '../shared/library/select/select';
import * as styles from './css/progress-note-context.css';

interface IProps {
  progressNoteTime: string;
  onTimeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function getTimes() {
  const times: Date[] = [];
  let time = 0;
  let date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  while (time < 24 * 4) {
    times.push(new Date(date));
    date = addMinutes(date, 15);
    time++;
  }
  return times;
}

export function getCurrentTime() {
  const date = new Date();
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

export const ProgressNoteTime: React.StatelessComponent<IProps> = props => {
  const { progressNoteTime, onTimeChange } = props;
  const progressNoteTimes = getTimes().map(time => (
    <option key={time.toISOString()} value={time.toISOString()}>
      {format(time, 'hh:mm A')}
    </option>
  ));
  return (
    <div className={styles.time}>
      <FormLabel messageId="progressNote.selectTime" />
      <Select value={progressNoteTime} onChange={onTimeChange}>
        <option value={''} disabled hidden>
          Select a time
        </option>
        {progressNoteTimes}
      </Select>
    </div>
  );
};
