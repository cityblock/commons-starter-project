import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './css/select.css';

interface IProps {
  value: string;
  onChange: (e?: any) => void;
  children?: any;
  className?: string;
  name?: string;
  required?: boolean;
}

const Select: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, onChange, className, children, name, required } = props;
  const selectStyles = classNames(styles.select, className);

  return (
    <select
      name={name}
      required={required}
      value={value || ''}
      className={selectStyles}
      onChange={onChange}
    >
      {children}
    </select>
  );
};

export default Select;
