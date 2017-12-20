import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import * as styles from './css/date-info.css';

type Label = 'created' | 'updated'; // displays text for created and updated

interface IProps {
  date: string;
  label?: Label; // use default translate message for label choices above
  messageId?: string; // provide either type or messageId
  highlight?: boolean; // puts date in blue text
}

const DateInfo: React.StatelessComponent<IProps> = (props: IProps) => {
  const { date, label, messageId, highlight } = props;
  const dateStyles = classNames(styles.date, {
    [styles.highlight]: !!highlight,
  });
  const formattedMessageId = label ? `dateInfo.${label}` : messageId;

  return (
    <div className={styles.container}>
      <FormattedMessage id={formattedMessageId as string}>
        {(message: string) => <h5>{message}</h5>}
      </FormattedMessage>
      <FormattedRelative value={date}>
        {(formattedDate: string) => <h5 className={dateStyles}>{formattedDate}</h5>}
      </FormattedRelative>
    </div>
  );
};

export default DateInfo;
