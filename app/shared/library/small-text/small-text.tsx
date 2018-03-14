import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/small-text.css';

export type Color = 'lightGray' | 'gray' | 'black' | 'white' | 'red' | 'green'; // default is lightGray
export type Size = 'small' | 'medium' | 'large' | 'largest';

export interface IProps {
  messageId?: string; // provide either raw text or message id
  messageValues?: { [key: string]: string }; // optional variable values for translation
  text?: string;
  color?: Color; // optional color flag
  size?: Size;
  className?: string;
  isBold?: boolean;
  onClick?: (e?: any) => void;
}

const SmallText: React.StatelessComponent<IProps> = (props: IProps) => {
  const { messageId, text, color, className, size, onClick, isBold, messageValues } = props;
  const textStyles = classNames(
    styles.text,
    {
      [styles.black]: color && color === 'black',
      [styles.gray]: color && color === 'gray',
      [styles.mediumFontSize]: size && size === 'medium',
      [styles.largeFontSize]: size && size === 'large',
      [styles.largestFontSize]: size && size === 'largest',
      [styles.white]: color && color === 'white',
      [styles.red]: color && color === 'red',
      [styles.green]: color && color === 'green',
      [styles.bold]: isBold,
    },
    className,
  );

  if (messageId) {
    return (
      <FormattedMessage id={messageId} values={messageValues}>
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
