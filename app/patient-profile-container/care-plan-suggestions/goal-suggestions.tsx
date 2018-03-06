import * as React from 'react';
import {
  getPatientCarePlanSuggestionsQuery,
  FullCarePlanSuggestionForPatientFragment,
} from '../../graphql/types';
import GoalSuggestion from './goal-suggestion';

interface IProps {
  suggestions: getPatientCarePlanSuggestionsQuery['carePlanSuggestionsForPatient'];
  onAccept: (
    suggestion: FullCarePlanSuggestionForPatientFragment,
    taskTemplateIds?: string[],
  ) => void;
  onDismiss: (suggestion: FullCarePlanSuggestionForPatientFragment) => void;
}

interface IState {
  selectedGoalSuggestionId: string;
}

class GoalSuggestions extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      selectedGoalSuggestionId: '',
    };
  }

  toggleSelectedGoalSuggestionId = (goalSuggestionId: string) => {
    if (this.state.selectedGoalSuggestionId === goalSuggestionId) {
      this.setState({ selectedGoalSuggestionId: '' });
    } else {
      this.setState({ selectedGoalSuggestionId: goalSuggestionId });
    }
  };

  render(): JSX.Element {
    const { suggestions, onAccept, onDismiss } = this.props;
    const { selectedGoalSuggestionId } = this.state;

    const goalSuggestions = suggestions.map(suggestion => {
      if (!suggestion) return null;

      return (
        <GoalSuggestion
          key={suggestion.id}
          suggestion={suggestion}
          onAccept={onAccept}
          onDismiss={onDismiss}
          selectedGoalSuggestionId={selectedGoalSuggestionId}
          toggleSelectedGoalSuggestionId={this.toggleSelectedGoalSuggestionId}
        />
      );
    });

    return <div>{goalSuggestions}</div>;
  }
}

export default GoalSuggestions;
