import classNames from 'classnames';
import React from 'react';
import styles from './css/checkbox-input.css';

interface IProps {
  value: string;
  checked: boolean;
  onChange: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string; // optional label, will default to value if not provided
  disabled?: boolean;
}

const CheckboxInput: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, checked, onChange, label, disabled } = props;
  const containerStyles = classNames(styles.container, {
    [styles.checked]: checked,
    [styles.disabled]: !!disabled,
  });

  return (
    <div className={containerStyles}>
      <input
        type="checkbox"
        id={value}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={!!disabled}
      />
      <label htmlFor={value}>{label || value}</label>
    </div>
  );
};

export default CheckboxInput;
