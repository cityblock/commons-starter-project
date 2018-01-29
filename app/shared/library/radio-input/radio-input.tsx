import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './css/radio-input.css';

interface IProps {
  value: string;
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  label?: string; // optional label, will default to value if not provided
  disabled?: boolean;
  name?: string;
}

const RadioInput: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, checked, onChange, onClick, label, disabled, name } = props;
  const containerStyles = classNames(styles.container, {
    [styles.checked]: checked,
    [styles.enabled]: !disabled,
  });

  return (
    <div className={containerStyles}>
      <input
        name={name}
        type="radio"
        id={value}
        value={value}
        checked={checked}
        onChange={onChange}
        onClick={onClick}
        disabled={!!disabled}
      />
      <label htmlFor={value}>{label || value}</label>
    </div>
  );
};

export default RadioInput;
