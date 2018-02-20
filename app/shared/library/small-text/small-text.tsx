import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/small-text.css';

export type Color = 'lightGray' | 'gray' | 'black' | 'white' | 'red'; // default is lightGray
export type Size = 'small' | 'medium';

export interface IProps {
  messageId?: string; // provide either raw text or message id
  text?: string;
  color?: Color; // optional color flag
  size?: Size;
  className?: string;
  onClick?: (e?: any) => void;
}

const SmallText: React.StatelessComponent<IProps> = (props: IProps) => {
  const { messageId, text, color, className, size, onClick } = props;
  const textStyles = classNames(
    styles.text,
    {
      [styles.black]: color && color === 'black',
      [styles.gray]: color && color === 'gray',
      [styles.mediumFontSize]: size && size === 'medium',
      [styles.white]: color && color === 'white',
      [styles.red]: color && color === 'red',
    },
    className,
  );

  if (messageId) {
    return (
      <FormattedMessage id={messageId}>
        {(message: string) => (
          <p className={textStyles} onClick={onClick}>
            {message}
          </p>
        )}
      </FormattedMessage>
    );
  }

  return <p className={textStyles}>{text}</p>;
};

export default SmallText;
