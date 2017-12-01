import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/form-label.css';

interface IProps {
  messageId: string;
  htmlFor?: string;
  gray?: boolean; // optional flag that makes text gray
}

const FormLabel: React.StatelessComponent<IProps> = (props: IProps) => {
  const { messageId, htmlFor, gray } = props;
  const labelStyles = classNames(styles.label, {
    [styles.completed]: !!gray,
  });

  return (
    <FormattedMessage id={messageId}>
      {(message: string) => (
        <label htmlFor={htmlFor} className={labelStyles}>
          {message}
        </label>
      )}
    </FormattedMessage>
  );
};

export default FormLabel;
