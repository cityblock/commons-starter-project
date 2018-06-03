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
  state = {
    selectedGoalSuggestionId: '',
  };

  componentWillReceiveProps(nextProps: IProps) {
    // if number of goal suggestions has changed because of accepting/denying them,
    // delect all goal suggestions
    if (nextProps.suggestions.length !== this.props.suggestions.length) {
      this.setState({ selectedGoalSuggestionId: '' });
    }
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
