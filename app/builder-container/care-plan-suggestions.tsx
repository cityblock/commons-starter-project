import * as classNames from 'classnames';
import * as React from 'react';
import { FullAnswerFragment } from '../graphql/types';
import * as styles from '../shared/css/two-panel-right.css';
import CarePlanSuggestion from './care-plan-suggestion';
import CarePlanSuggestionCreate from './care-plan-suggestion-create';

interface IProps {
  answer: FullAnswerFragment;
}

class CarePlanSuggestions extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);

    this.renderCarePlanSuggestions = this.renderCarePlanSuggestions.bind(this);
    this.renderConcernSuggestions = this.renderConcernSuggestions.bind(this);
    this.renderGoalSuggestions = this.renderGoalSuggestions.bind(this);
  }

  renderConcernSuggestions() {
    const { answer } = this.props;
    const { concernSuggestions } = answer;

    if (concernSuggestions && concernSuggestions.length) {
      const concernSuggestionsHtml = concernSuggestions.map((concernSuggestion, index) => (
        <CarePlanSuggestion
          key={concernSuggestion ? concernSuggestion.id : index}
          answerId={answer.id}
          suggestionType='concern'
          suggestion={concernSuggestion}
        />
      ));

      return <div className={styles.indented}>{concernSuggestionsHtml}</div>;
    } else {
      const noSuggestionsStyles = classNames(styles.smallText, styles.indented);
      return <div className={noSuggestionsStyles}>No concern suggestions</div>;
    }
  }

  renderGoalSuggestions() {
    const { answer } = this.props;
    const { goalSuggestions } = answer;

    if (goalSuggestions && goalSuggestions.length) {
      const goalSuggestionsHtml = goalSuggestions.map((goalSuggestion, index) => (
        <CarePlanSuggestion
          key={goalSuggestion ? goalSuggestion.id : index}
          answerId={answer.id}
          suggestionType='goal'
          suggestion={goalSuggestion}
        />
      ));

      return <div className={styles.indented}>{goalSuggestionsHtml}</div>;
    } else {
      const noSuggestionsStyles = classNames(styles.smallText, styles.indented);
      return <div className={noSuggestionsStyles}>No goal/task suggestions</div>;
    }
  }

  renderCarePlanSuggestions() {
    const suggestionsStyles = classNames(styles.smallText, styles.smallMargin);
    return (
      <div>
        <div className={suggestionsStyles}>Concern Suggestions</div>
        {this.renderConcernSuggestions()}
        <br />
        <div className={suggestionsStyles}>Goal/Task Suggestions</div>
        {this.renderGoalSuggestions()}
      </div>
    );
  }

  render() {
    const { answer } = this.props;
    return (
      <div>
        <br />
        <div className={styles.smallText}>Care Plan Suggestions</div>
        <br />
        {this.renderCarePlanSuggestions()}
        <br />
        <div className={styles.smallText}>Add Care Plan Suggestion</div>
        <CarePlanSuggestionCreate answer={answer} />
      </div>
    );
  }
}

export default CarePlanSuggestions;
