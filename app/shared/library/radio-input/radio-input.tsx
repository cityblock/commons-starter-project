import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './css/radio-input.css';

interface IProps {
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string; // optional label, will default to value if not provided
  disabled?: boolean;
}

const RadioInput: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, checked, onChange, label, disabled } = props;
  const containerStyles = classNames(styles.container, {
    [styles.checked]: checked,
    [styles.enabled]: !disabled,
  });

  return (
    <div className={containerStyles}>
      <input
        type="radio"
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

export default RadioInput;
