import classNames from 'classnames';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './css/text-divider.css';

type Color = 'lightBlue' | 'gray' | 'navy' | 'black'; // default is light blue

interface IProps {
  messageId?: string; // strongly prefer using messageId over label
  label?: string;
  color?: Color; // changes text color
  hasPadding?: boolean; // optional flag to add medium gutter margins
}

const TextDivider: React.StatelessComponent<IProps> = ({ messageId, label, color, hasPadding }) => {
  const text = messageId ? (
    <FormattedMessage id={messageId}>{(message: string) => <p>{message}</p>}</FormattedMessage>
  ) : (
    <p>{label}</p>
  );

  const containerStyles = classNames(styles.container, {
    [styles.gray]: color === 'gray',
    [styles.navy]: color === 'navy',
    [styles.black]: color === 'black',
    [styles.padding]: !!hasPadding,
  });

  return (
    <div className={containerStyles}>
      {text}
      <div className={styles.divider} />
    </div>
  );
};

export default TextDivider;
