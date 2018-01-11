import * as classNames from 'classnames';
import { capitalize } from 'lodash';
import * as React from 'react';
import { FormattedRelative } from 'react-intl';
import { isDueSoon } from '../../helpers/format-helpers';
import TextInfo from '../text-info/text-info';
import * as styles from './css/date-info.css';

type Label = 'created' | 'updated' | 'due'; // predefined translate message ids
type Units = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year';

interface IProps {
  date: string | null;
  label?: Label; // use default translate message for label choices above
  messageId?: string; // provide either label or messageId
  units?: Units; // optional units prop for formatted relative
  className?: string; // use largely for margin/padding
  highlightBlue?: boolean; // puts date in blue text
  highlightDueSoon?: boolean; // puts date in red text if due soon
}

const DateInfo: React.StatelessComponent<IProps> = (props: IProps) => {
  const { date, label, messageId, units, className, highlightBlue, highlightDueSoon } = props;
  const dateStyles = classNames({
    [styles.highlightBlue]: !!highlightBlue,
    [styles.highlightRed]: !!highlightDueSoon && isDueSoon(date),
  });
  const formattedMessageId: string = label ? `dateInfo.${label}` : messageId || '';

  if (date === null) {
    return (
      <TextInfo
        messageId={formattedMessageId}
        textMessageId="dateInfo.nullDate"
        textStyles={dateStyles}
      />
    );
  }

  return (
    <div className={className}>
      <FormattedRelative value={date} units={units}>
        {(formattedDate: string) => (
          <TextInfo
            messageId={formattedMessageId}
            text={capitalize(formattedDate)}
            textStyles={dateStyles}
          />
        )}
      </FormattedRelative>
    </div>
  );
};

export default DateInfo;
