import classNames from 'classnames';
import React from 'react';
import DefaultText from '../default-text/default-text';
import styles from './css/checkbox.css';

interface IProps {
  isChecked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  labelMessageId?: string;
  labelClassName?: string;
  disabled?: boolean;
  name?: string;
}

const Checkbox: React.StatelessComponent<IProps> = (props: IProps) => {
  const { isChecked, onChange, className, labelMessageId, name, labelClassName, disabled } = props;

  const labelStyles = classNames(styles.label, labelClassName);

  const labelComponent = labelMessageId ? (
    <DefaultText messageId={labelMessageId} color="gray" className={labelStyles} />
  ) : null;

  return (
    <div className={className}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        name={name}
        disabled={!!disabled}
      />
      {labelComponent}
    </div>
  );
};

export default Checkbox;
