import * as classNames from 'classnames';
import * as React from 'react';
import Option from '../option/option';
import * as styles from './css/select.css';

interface IProps {
  value: string;
  onChange: (e?: any) => void;
  options?: string[];
  hasPlaceholder?: boolean;
  children?: any;
  className?: string;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  large?: boolean; // makes select 50px tall
  isUnselectable?: boolean;
}

const Select: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    value,
    onChange,
    className,
    children,
    disabled,
    name,
    required,
    large,
    options,
    isUnselectable,
    hasPlaceholder,
  } = props;

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

  const placeholderComponent = hasPlaceholder ? (
    <Option disabled={!isUnselectable} messageId={`${name}.placeholder`} value="" />
  ) : null;

  const optionsComponent = options ? (
    options.map(option => <Option
      value={option}
      messageId={`${name}.${option}`}
      key={`${name}-option-${option}`}
    />)
  ) : null;

  return (
    <select
      name={name}
      required={required}
      value={value}
      className={selectStyles}
      onChange={onChange}
      disabled={disabled}
    >
      {placeholderComponent}
      {optionsComponent}
      {children}
    </select>
  );
};

export default Select;
