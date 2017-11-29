import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/button.css';

type Color = 'blue' | 'white' | 'red';

interface IProps {
  onClick: () => void;
  messageId?: string; // prefer using translate message ids
  label?: string; // use this if not translating
  color?: Color; // if not provided, defaults to blue
  small?: boolean;
  className?: string;
}

const Button: React.StatelessComponent<IProps> = (props: IProps) => {
  const { messageId, label, onClick, color, small, className } = props;

  const buttonStyles = classNames(
    styles.button,
    {
      [styles.white]: color === 'white',
      [styles.red]: color === 'red',
      [styles.small]: small,
    },
    className,
  );

  if (messageId) {
    return (
      <FormattedMessage id={messageId}>
        {(message: string) => (
          <button onClick={onClick} className={buttonStyles}>
            {message}
          </button>
        )}
      </FormattedMessage>
    );
  }

  return (
    <button onClick={onClick} className={buttonStyles}>
      {label}
    </button>
  );
};

export default Button;
