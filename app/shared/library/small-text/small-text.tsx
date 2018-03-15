import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/small-text.css';

export type Color =
  | 'lightGray'
  | 'gray'
  | 'darkGray'
  | 'black'
  | 'white'
  | 'red'
  | 'green'
  | 'purple'; // default is lightGray
export type Size = 'small' | 'medium' | 'large' | 'largest'; // default is small
export type Font = 'roboto' | 'basetica'; // default is Roboto

export interface IProps {
  messageId?: string; // provide either raw text or message id
  messageValues?: { [key: string]: string }; // optional variable values for translation
  text?: string;
  color?: Color; // optional color flag
  size?: Size;
  className?: string;
  isBold?: boolean;
  onClick?: (e?: any) => void;
  font?: Font;
}

const SmallText: React.StatelessComponent<IProps> = (props: IProps) => {
  const { messageId, text, color, className, size, onClick, isBold, messageValues, font } = props;
  const textStyles = classNames(
    styles.text,
    {
      [styles.black]: color && color === 'black',
      [styles.gray]: color && color === 'gray',
      [styles.darkGray]: color && color === 'darkGray',
      [styles.mediumFontSize]: size && size === 'medium',
      [styles.largeFontSize]: size && size === 'large',
      [styles.largestFontSize]: size && size === 'largest',
      [styles.white]: color && color === 'white',
      [styles.red]: color && color === 'red',
      [styles.purple]: color && color === 'purple',
      [styles.green]: color && color === 'green',
      [styles.bold]: isBold,
      [styles.basetica]: font === 'basetica',
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
