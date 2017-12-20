import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/small-text.css';

interface IProps {
  messageId?: string; // provide either raw text or message id
  text?: string;
  className?: string;
}

const SmallText: React.StatelessComponent<IProps> = (props: IProps) => {
  const { messageId, text, className } = props;
  const textStyles = classNames(styles.text, className);

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
