import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './css/radio-input.css';

interface IProps {
  value: string;
  name: string;
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  label?: string; // optional label, will default to value if not provided
  disabled?: boolean;
  fullWidth?: boolean;
  readOnly?: boolean;
}

const RadioInput: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, checked, onChange, onClick, label, disabled, name, fullWidth, readOnly } = props;
  const containerStyles = classNames(styles.container, {
    [styles.checked]: checked,
    [styles.enabled]: !disabled,
    [styles.fullWidth]: fullWidth,
  });

  return (
    <div className={containerStyles}>
      <input
        name={name}
        type="radio"
        id={`${name}-${value}`}
        value={value}
        checked={checked}
        onChange={onChange}
        onClick={onClick}
        disabled={!!disabled}
        readOnly={!!readOnly}
      />
      <label htmlFor={`${name}-${value}`}>{label || value}</label>
    </div>
  );
};

export default RadioInput;
