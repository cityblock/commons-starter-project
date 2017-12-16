import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../icon/icon';
import { IconName } from '../icon/icon-types';
import * as styles from './css/button.css';

type Color = 'blue' | 'white' | 'red';

interface IProps {
  onClick: () => void;
  messageId?: string; // prefer using translate message ids
  label?: string; // use this if not translating
  color?: Color | null; // if not provided, defaults to blue
  small?: boolean | null;
  fullWidth?: boolean | null;
  disabled?: boolean; // optional flag to disable button
  className?: string | null;
  icon?: IconName | null; // WIP, use at own risk
}

const Button: React.StatelessComponent<IProps> = (props: IProps) => {
  const { messageId, label, onClick, color, small, icon, className, fullWidth, disabled } = props;

  const buttonStyles = classNames(
    {
      [styles.button]: !icon,
      [styles.iconButton]: !!icon,
      [styles.white]: color === 'white',
      [styles.red]: color === 'red',
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
            {icon && <Icon name={icon} className={styles.icon} />}
            {message}
          </button>
        )}
      </FormattedMessage>
    );
  }

  return (
    <button onClick={onClick} className={buttonStyles} disabled={disabled || false}>
      {icon && <Icon name={icon} className={styles.icon} />}
      {label}
    </button>
  );
};

export default Button;
