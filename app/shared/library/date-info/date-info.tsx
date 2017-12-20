import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedRelative } from 'react-intl';
import SmallText from '../small-text/small-text';
import * as styles from './css/date-info.css';

type Label = 'created' | 'updated'; // displays text for created and updated

interface IProps {
  date: string;
  label?: Label; // use default translate message for label choices above
  messageId?: string; // provide either type or messageId
  className?: string;
  highlight?: boolean; // puts date in blue text
}

const DateInfo: React.StatelessComponent<IProps> = (props: IProps) => {
  const { date, label, messageId, className, highlight } = props;
  const dateStyles = classNames(styles.date, {
    [styles.highlight]: !!highlight,
  });
  const formattedMessageId = label ? `dateInfo.${label}` : messageId;

  return (
    <div className={className}>
      <SmallText messageId={formattedMessageId} />
      <FormattedRelative value={date}>
        {(formattedDate: string) => <SmallText text={formattedDate} className={dateStyles} />}
      </FormattedRelative>
    </div>
  );
};

export default DateInfo;
