import * as classNames from 'classnames';
import { groupBy, uniqBy } from 'lodash';
import * as React from 'react';
import { FullCarePlanSuggestionForPatientFragment } from '../../graphql/types';
import TextDivider from '../../shared/library/text-divider/text-divider';
import TextInfo from '../../shared/library/text-info/text-info';
import CarePlanSuggestion from './care-plan-suggestion';
import * as styles from './css/suggestions-group.css';
import GoalSuggestions from './goal-suggestions';

interface IProps {
  title: string;
  suggestions: FullCarePlanSuggestionForPatientFragment[];
  isSelected: boolean;
  isHidden: boolean;
  onAccept: (
    suggestion: FullCarePlanSuggestionForPatientFragment,
    taskTemplateIds?: string[],
  ) => void;
  onDismiss: (suggestion: FullCarePlanSuggestionForPatientFragment) => void;
  onClick: () => void;
}

export class SuggestionsGroup extends React.Component<IProps> {
  renderConcerns(suggestions: FullCarePlanSuggestionForPatientFragment[]) {
    const { onAccept, onDismiss } = this.props;

    return suggestions.map(suggestion => (
      <CarePlanSuggestion
        key={suggestion.id}
        suggestion={suggestion}
        onAccept={() => onAccept(suggestion)}
        onDismiss={() => onDismiss(suggestion)}
      />
    ));
  }

  renderGoals(suggestions: FullCarePlanSuggestionForPatientFragment[]) {
    const { onAccept, onDismiss } = this.props;

    return <GoalSuggestions suggestions={suggestions} onAccept={onAccept} onDismiss={onDismiss} />;
  }

  render() {
    const { suggestions, title, isSelected, isHidden, onClick } = this.props;
    const subGroups = groupBy(suggestions, 'suggestionType');
    const concernSuggestions = uniqBy(subGroups.concern, 'concernId');
    const goalSuggestions = uniqBy(subGroups.goal, 'goalSuggestionTemplateId');

    const concernSuggestionsHtml = this.renderConcerns(concernSuggestions);
    const goalSuggestionsHtml = this.renderGoals(goalSuggestions);
    const dividerHtml =
      concernSuggestions.length && goalSuggestions.length ? <TextDivider /> : null;

    const bodyStyles = classNames({ [styles.hidden]: !isSelected });
    const headerStyles = classNames(styles.header, { [styles.selected]: isSelected });

    return (
      <div className={classNames({ [styles.hidden]: isHidden })}>
        <div className={headerStyles} onClick={onClick}>
          <div className={styles.title}>{title}</div>
          <div className={styles.stats}>
            <TextInfo
              messageId="suggestionsGroup.concerns"
              text={concernSuggestions.length}
              className={styles.stat}
            />
            <TextInfo
              messageId="suggestionsGroup.goals"
              text={goalSuggestions.length}
              className={styles.stat}
            />
          </div>
        </div>
        <div className={bodyStyles}>
          {concernSuggestionsHtml}
          {dividerHtml}
          {goalSuggestionsHtml}
        </div>
      </div>
    );
  }
}

export default SuggestionsGroup;
