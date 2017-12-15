import * as classNames from 'classnames';
import * as React from 'react';
import { formatInputDate } from '../../helpers/format-helpers';
import * as styles from './css/date-input.css';

interface IProps {
  value: string; // use timestamp
  onChange: (e?: any) => void;
  className?: string;
  id?: string;
  name?: string;
}

const DateInput: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, onChange, className, id, name } = props;
  const dateInputStyles = classNames(styles.dateInput, className);
  const formattedValue = formatInputDate(value);

  return (
    <input
      type="date"
      value={formattedValue}
      onChange={onChange}
      className={dateInputStyles}
      data-date={value}
      id={id || ''}
      name={name || ''}
    />
  );
};

export default DateInput;
