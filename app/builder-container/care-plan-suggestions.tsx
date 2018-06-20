import classNames from 'classnames';
import React from 'react';
import {
  FullAnswer,
  FullConcern,
  FullGoalSuggestionTemplate,
  FullScreeningToolScoreRange,
} from '../graphql/types';
import styles from '../shared/css/two-panel-right.css';
import CarePlanSuggestion from './care-plan-suggestion';
import CarePlanSuggestionCreate from './care-plan-suggestion-create';

interface IProps {
  answer?: FullAnswer;
  scoreRange?: FullScreeningToolScoreRange;
}

class CarePlanSuggestions extends React.Component<IProps> {
  renderConcernSuggestions() {
    const { answer, scoreRange } = this.props;

    let concernSuggestions: FullConcern[] | null = null;

    if (answer) {
      concernSuggestions = answer.concernSuggestions as FullConcern[];
    } else if (scoreRange) {
      concernSuggestions = scoreRange.concernSuggestions as FullConcern[];
    }

    if (concernSuggestions && concernSuggestions.length) {
      const concernSuggestionsHtml = concernSuggestions.map((concernSuggestion, index) => (
        <CarePlanSuggestion
          key={concernSuggestion ? concernSuggestion.id : index}
          answerId={answer ? answer.id : null}
          screeningToolScoreRangeId={scoreRange ? scoreRange.id : null}
          suggestionType="concern"
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
    const { answer, scoreRange } = this.props;
    let goalSuggestions: FullGoalSuggestionTemplate[] | null = null;

    if (answer) {
      goalSuggestions = answer.goalSuggestions as FullGoalSuggestionTemplate[];
    } else if (scoreRange) {
      goalSuggestions = scoreRange.goalSuggestions as FullGoalSuggestionTemplate[];
    }

    if (goalSuggestions && goalSuggestions.length) {
      const goalSuggestionsHtml = goalSuggestions.map((goalSuggestion, index) => (
        <CarePlanSuggestion
          key={goalSuggestion ? goalSuggestion.id : index}
          answerId={answer ? answer.id : null}
          screeningToolScoreRangeId={scoreRange ? scoreRange.id : null}
          suggestionType="goal"
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
    const { answer, scoreRange } = this.props;
    return (
      <div>
        <br />
        <div className={styles.smallText}>Care Plan Suggestions</div>
        <br />
        {this.renderCarePlanSuggestions()}
        <br />
        <div className={styles.smallText}>Add Care Plan Suggestion</div>
        <CarePlanSuggestionCreate
          answer={answer || null}
          screeningToolScoreRange={scoreRange || null}
          goals={null}
          concerns={null}
        />
      </div>
    );
  }
}

export default CarePlanSuggestions;
