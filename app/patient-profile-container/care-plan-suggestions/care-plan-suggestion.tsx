import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FullCarePlanSuggestionForPatientFragment } from '../../graphql/types';
import DateInfo from '../../shared/library/date-info/date-info';
import Icon from '../../shared/library/icon/icon';
import TextInfo from '../../shared/library/text-info/text-info';
import * as styles from './css/care-plan-suggestion.css';
import SuggestionSource from './suggestion-source';

interface IProps {
  suggestion: FullCarePlanSuggestionForPatientFragment;
  onAccept: () => void;
  onDismiss: () => void;
  hideButtons?: boolean;
}

class CarePlanSuggestion extends React.Component<IProps> {
  // prevent clicking on icons from closing an open suggestion
  onAccept = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    this.props.onAccept();
  };

  onDismiss = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    this.props.onDismiss();
  };

  render(): JSX.Element {
    const { suggestion, hideButtons } = this.props;
    const isGoal = suggestion.suggestionType === 'goal';

    const titleMessageId = `carePlanSuggestion.${suggestion.suggestionType}`;
    const suggestionTitle = !isGoal
      ? suggestion.concern!.title
      : suggestion.goalSuggestionTemplate!.title;

    const containerStyles = classNames(styles.container, {
      [styles.goal]: isGoal,
    });

    return (
      <div className={containerStyles}>
        <div>
          <div className={styles.header}>
            <FormattedMessage id={titleMessageId}>
              {(message: string) => <h2 className={styles.title}>{message}</h2>}
            </FormattedMessage>
            <SuggestionSource suggestion={suggestion} />
          </div>
          <h1>{suggestionTitle}</h1>
          <div className={styles.info}>
            <DateInfo label="suggested" date={suggestion.createdAt} />
            {isGoal && (
              <TextInfo
                messageId="carePlanSuggestion.tasks"
                text={suggestion.goalSuggestionTemplate!.taskTemplates.length}
                className={styles.marginLeft}
              />
            )}
          </div>
        </div>
        {!hideButtons && (
          <div className={styles.actions}>
            <Icon name="close" color="red" onClick={this.onDismiss} className={styles.icon} />
            <Icon name="check" color="green" onClick={this.onAccept} className={styles.icon} />
          </div>
        )}
      </div>
    );
  }
}

export default CarePlanSuggestion;
