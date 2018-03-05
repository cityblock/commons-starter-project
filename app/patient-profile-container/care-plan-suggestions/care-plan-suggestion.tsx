import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FullCarePlanSuggestionForPatientFragment } from '../../graphql/types';
import DateInfo from '../../shared/library/date-info/date-info';
import Icon from '../../shared/library/icon/icon';
import * as styles from './css/care-plan-suggestion.css';
import SuggestionSource from './suggestion-source';

interface IProps {
  suggestion: FullCarePlanSuggestionForPatientFragment;
  onAccept: () => void;
  onDismiss: () => void;
}

const CarePlanSuggestion: React.StatelessComponent<IProps> = (props: IProps) => {
  const { suggestion, onAccept, onDismiss } = props;
  const titleMessageId = `carePlanSuggestion.${suggestion.suggestionType}`;
  const suggestionTitle =
    suggestion.suggestionType === 'concern'
      ? suggestion.concern!.title
      : suggestion.goalSuggestionTemplate!.title;

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.header}>
          <FormattedMessage id={titleMessageId}>
            {(message: string) => <h2 className={styles.title}>{message}</h2>}
          </FormattedMessage>
          <SuggestionSource suggestion={suggestion} />
        </div>
        <h1>{suggestionTitle}</h1>
        <DateInfo label="suggested" date={suggestion.createdAt} />
      </div>
      <div className={styles.actions}>
        <Icon name="close" color="red" onClick={onDismiss} className={styles.icon} />
        <Icon name="check" color="green" onClick={onAccept} className={styles.icon} />
      </div>
    </div>
  );
};

export default CarePlanSuggestion;
