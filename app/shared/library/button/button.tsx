import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/button.css';

type Color = 'blue' | 'white' | 'red';

// Note: blue is default color
interface IProps {
  onClick: () => void;
  messageId?: string;
  label?: string;

  color?: Color;
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
