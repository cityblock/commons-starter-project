import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/small-text.css';

export type Color = 'lightGray' | 'gray' | 'black'; // default is lightGray
export type Size = 'small' | 'medium';

export interface IProps {
  messageId?: string; // provide either raw text or message id
  text?: string;
  color?: Color; // optional color flag
  size?: Size;
  className?: string;
}

const SmallText: React.StatelessComponent<IProps> = (props: IProps) => {
  const { messageId, text, color, className, size } = props;
  const textStyles = classNames(
    styles.text,
    {
      [styles.black]: color && color === 'black',
      [styles.gray]: color && color === 'gray',
      [styles.mediumFontSize]: size && size === 'medium',
    },
    className,
  );

  if (messageId) {
    return (
      <FormattedMessage id={messageId}>
        {(message: string) => <p className={textStyles}>{message}</p>}
      </FormattedMessage>
    );
  }

  return <p className={textStyles}>{text}</p>;
};

export default SmallText;
