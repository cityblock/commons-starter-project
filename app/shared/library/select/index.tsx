import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './css/index.css';

interface IProps {
  value: string;
  onChange: (e?: any) => void;
  children?: any;
  className?: string;
}

const Select: React.StatelessComponent<IProps> = ({ value, onChange, className, children }) => {
  const selectStyles = classNames(styles.select, className);

  return (
    <select value={value || ''} className={selectStyles} onChange={onChange}>
      {children}
    </select>
  );
};

export default Select;
