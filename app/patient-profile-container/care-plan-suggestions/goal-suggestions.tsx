import * as React from 'react';
import { FullCarePlanSuggestionForPatientFragment } from '../../graphql/types';
import GoalSuggestion from './goal-suggestion';

interface IProps {
  suggestions: FullCarePlanSuggestionForPatientFragment[];
  onAccept: (
    suggestion: FullCarePlanSuggestionForPatientFragment,
    taskTemplateIds?: string[],
  ) => void;
  onDismiss: (suggestion: FullCarePlanSuggestionForPatientFragment) => void;
}

interface IState {
  selectedGoalSuggestionId: string;
  suggestionsLength?: number;
}

class GoalSuggestions extends React.Component<IProps, IState> {
  static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
    // if number of goal suggestions has changed because of accepting/denying them,
    // delect all goal suggestions
    if (nextProps.suggestions.length !== prevState.suggestionsLength) {
      return {
        selectedGoalSuggestionId: '',
        suggestionsLength: nextProps.suggestions.length,
      };
    }
    return null;
  }

  state = {
    selectedGoalSuggestionId: '',
  } as IState;

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
