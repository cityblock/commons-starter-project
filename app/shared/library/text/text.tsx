import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/text.css';

export type Color =
  | 'lightGray'
  | 'gray'
  | 'darkGray'
  | 'black'
  | 'white'
  | 'red'
  | 'green'
  | 'purple'
  | 'blue'
  | 'lightBlue'; // default is lightGray
export type Size = 'small' | 'medium' | 'large' | 'largest'; // default is small
export type Font = 'roboto' | 'basetica' | 'baseticaBold'; // default is Roboto

export interface IProps {
  messageId?: string; // provide either message id (preferred) or raw text
  messageValues?: { [key: string]: string }; // optional variable values for translation
  text?: string;
  color?: Color; // optional color flag
  size?: Size;
  className?: string;
  isBold?: boolean;
  onClick?: (e?: any) => void;
  font?: Font;
  isHeader?: boolean; // if true, use h1 rather than p
}

const Text: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    messageId,
    text,
    color,
    className,
    size,
    onClick,
    isBold,
    messageValues,
    font,
    isHeader,
  } = props;
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
      [styles.blue]: color && color === 'blue',
      [styles.lightBlue]: color && color === 'lightBlue',
      [styles.bold]: isBold,
      [styles.basetica]: font === 'basetica',
      [styles.baseticaBold]: font === 'baseticaBold',
      [styles.header]: isHeader,
    },
    className,
  );

  if (messageId) {
    return (
      <FormattedMessage id={messageId} values={messageValues}>
        {(message: string) => {
          if (isHeader) {
            return (
              <h1 className={textStyles} onClick={onClick}>
                {message}
              </h1>
            );
          }

          return (
            <p className={textStyles} onClick={onClick}>
              {message}
            </p>
          );
        }}
      </FormattedMessage>
    );
  }

  if (isHeader) {
    return <h1 className={textStyles}>{text}</h1>;
  }

  return <p className={textStyles}>{text}</p>;
};

export default Text;
