import classNames from 'classnames';
import React from 'react';
import { Fragment } from 'react';
import Option from '../option/option';
import Text from '../text/text';
import styles from './css/select.css';

export type Color = 'black' | 'blue';

interface IProps {
  value: string | number;
  onChange: (e?: any) => void;
  options?: string[];
  prefix?: string;
  hasPlaceholder?: boolean;
  children?: any;
  className?: string;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  errorMessageId?: string;
  hasError?: boolean;
  large?: boolean; // makes select 50px tall
  isUnselectable?: boolean;
  color?: Color; // default is black
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
    hasError,
    errorMessageId,
    large,
    options,
    isUnselectable,
    hasPlaceholder,
    color,
  } = props;

  const errorMessage = hasError ? <Text messageId={errorMessageId} color="red" /> : null;

  const selectStyles = classNames(
    styles.select,
    {
      [styles.large]: !!large,
      [styles.noValue]: !value,
      [styles.disabled]: !!disabled,
      [styles.empty]: !!disabled && !value,
      [styles.blue]: color && color === 'blue',
      [styles.error]: hasError,
    },
    className,
  );

  const prefix = props.prefix || name || '';
  const placeholderComponent = hasPlaceholder ? (
    <Option disabled={!isUnselectable} messageId={`${prefix}.placeholder`} value="" />
  ) : null;

  const optionsComponent = options
    ? options.map(option => (
        <Option
          value={option}
          messageId={`${prefix}.${option}`}
          key={`${prefix}-option-${option}`}
        />
      ))
    : null;

  return (
    <Fragment>
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
      {errorMessage}
    </Fragment>
  );
};

export default Select;
