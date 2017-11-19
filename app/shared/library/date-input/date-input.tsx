import * as classNames from 'classnames';
import * as React from 'react';
import { formatInputDate } from '../../helpers/format-helpers';
import * as styles from './css/date-input.css';

interface IProps {
  value: string; // use timestamp
  onChange: (e?: any) => void;
  displayText?: string;
  className?: string;
}

const DateInput: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, onChange, displayText, className } = props;
  const dateInputStyles = classNames(styles.dateInput, className);
  const formattedValue = formatInputDate(value);

  return (
    <input
      type="date"
      value={formattedValue}
      onChange={onChange}
      className={dateInputStyles}
      data-date={displayText || value}
    />
  );
};

export default DateInput;
