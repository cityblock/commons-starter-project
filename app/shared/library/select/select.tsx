import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './css/select.css';

interface IProps {
  value: string;
  onChange: (e?: any) => void;
  children?: any;
  className?: string;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  large?: boolean; // makes select 50px tall
}

const Select: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, onChange, className, children, disabled, name, required, large } = props;

  const selectStyles = classNames(
    styles.select,
    {
      [styles.large]: !!large,
      [styles.noValue]: !value,
      [styles.disabled]: !!disabled,
      [styles.empty]: !!disabled && !value,
    },
    className,
  );

  return (
    <select
      name={name}
      required={required}
      value={value}
      className={selectStyles}
      onChange={onChange}
      disabled={disabled}
    >
      {children}
    </select>
  );
};

export default Select;
