import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../icon/icon';
import { IconName } from '../icon/icon-types';
import * as styles from './css/button.css';

export type Color = 'blue' | 'white' | 'red' | 'teal' | 'gray';
export type IconFillColor = 'white' | 'blue' | 'green';

export interface IProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  messageId?: string; // prefer using translate message ids
  label?: string; // use this if not translating
  color?: Color | null; // if not provided, defaults to blue
  small?: boolean | null;
  fullWidth?: boolean | null;
  disabled?: boolean; // optional flag to disable button
  className?: string | null;
  icon?: IconName | null; // WIP, use at own risk
  iconFillColor?: IconFillColor | null;
}

const Button: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    messageId,
    label,
    onClick,
    color,
    small,
    icon,
    className,
    fullWidth,
    disabled,
    iconFillColor,
  } = props;

  const buttonStyles = classNames(
    {
      [styles.button]: !icon,
      [styles.iconButton]: !!icon,
      [styles.white]: color === 'white',
      [styles.red]: color === 'red',
      [styles.teal]: color === 'teal',
      [styles.gray]: color === 'gray',
      [styles.iconFillWhite]: iconFillColor === 'white',
      [styles.iconFillBlue]: iconFillColor === 'blue',
      [styles.iconFillGreen]: iconFillColor === 'green',
      [styles.small]: small,
      [styles.fullWidth]: fullWidth,
      [styles.disabled]: !!disabled,
    },
    className,
  );

  if (messageId) {
    return (
      <FormattedMessage id={messageId}>
        {(message: string) => (
          <button onClick={onClick} className={buttonStyles} disabled={disabled || false}>
            <span className={styles.flex}>
              {icon && <Icon name={icon} className={styles.icon} />}
              <span>{message}</span>
            </span>
          </button>
        )}
      </FormattedMessage>
    );
  }

  return (
    <button onClick={onClick} className={buttonStyles} disabled={disabled || false}>
      <span className={styles.flex}>
        {icon && <Icon name={icon} className={styles.icon} />}
        <span>{label}</span>
      </span>
    </button>
  );
};

export default Button;
