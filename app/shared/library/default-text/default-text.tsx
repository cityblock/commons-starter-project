import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/default-text.css';

type Color = 'black' | 'lightBlue' | 'lightGray' | 'gray';

interface IProps {
  messageId?: string; // use for translation
  label?: string; // use if not translating
  color?: Color; // default is black
  inline?: boolean; // if true, display as inline
  className?: string;
}

const DefaultText: React.StatelessComponent<IProps> = (props: IProps) => {
  const { messageId, label, color, inline, className } = props;
  const textStyles = classNames(
    styles.text,
    {
      [styles.lightBlue]: color && color === 'lightBlue',
      [styles.lightGray]: color && color === 'lightGray',
      [styles.gray]: color && color === 'gray',
      [styles.inline]: !!inline,
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

  return <p className={textStyles}>{label}</p>;
};

export default DefaultText;
