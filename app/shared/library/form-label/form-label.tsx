import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/form-label.css';

interface IProps {
  messageId?: string; // use either message id (strongly preferred) or text
  text?: string;
  htmlFor?: string;
  topPadding?: boolean; // give extra padding on top
  className?: string;
  gray?: boolean; // optional flag that makes text gray
  small?: boolean; // optional flag to make text smaller
}

const FormLabel: React.StatelessComponent<IProps> = (props: IProps) => {
  const { messageId, text, htmlFor, topPadding, className, gray, small } = props;
  const labelStyles = classNames(
    styles.label,
    {
      [styles.completed]: !!gray,
      [styles.topPadding]: !!topPadding,
      [styles.small]: !!small,
    },
    className,
  );

  if (messageId) {
    return (
      <FormattedMessage id={messageId}>
        {(message: string) => (
          <label htmlFor={htmlFor} className={labelStyles}>
            {message}
          </label>
        )}
      </FormattedMessage>
    );
  }

  return (
    <label htmlFor={htmlFor} className={labelStyles}>
      {text || ''}
    </label>
  );
};

export default FormLabel;
