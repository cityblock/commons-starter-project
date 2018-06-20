import classNames from 'classnames';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './css/checkbox-input.css';

interface IProps {
  value: string;
  checked: boolean;
  onChange: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string; // optional label, will default to value if not provided
  labelMessageId?: string;
  disabled?: boolean;
}

const CheckboxInput: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, checked, onChange, label, labelMessageId, disabled } = props;
  const containerStyles = classNames(styles.container, {
    [styles.checked]: checked,
    [styles.disabled]: !!disabled,
  });

  const labelHtml = labelMessageId ? (
    <FormattedMessage id={labelMessageId}>
      {(message: string) => <label htmlFor={value}>{message}</label>}
    </FormattedMessage>
  ) : (
    <label htmlFor={value}>{label || value}</label>
  );

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
      {labelHtml}
    </div>
  );
};

export default CheckboxInput;
