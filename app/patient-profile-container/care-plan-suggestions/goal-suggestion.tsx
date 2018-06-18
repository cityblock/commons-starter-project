import classNames from 'classnames';
import React from 'react';
import { FullCarePlanSuggestionForPatientFragment } from '../../graphql/types';
import CarePlanSuggestion from './care-plan-suggestion';
import styles from './css/goal-suggestion.css';
import TaskTemplate from './task-template';

interface IProps {
  suggestion: FullCarePlanSuggestionForPatientFragment;
  onAccept: (
    suggestion: FullCarePlanSuggestionForPatientFragment,
    taskTemplateIds?: string[],
  ) => void;
  onDismiss: (suggestion: FullCarePlanSuggestionForPatientFragment) => void;
  selectedGoalSuggestionId: string;
  toggleSelectedGoalSuggestionId: (goalSuggestionId: string) => void;
}

interface IState {
  taskTemplateIds: string[];
}

class GoalSuggestion extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    const taskTemplateIds = this.props.suggestion.goalSuggestionTemplate!.taskTemplates.map(
      taskTemplate => taskTemplate.id,
    );

    this.state = { taskTemplateIds };
  }

  onToggleTaskTemplate = (taskTemplateId: string) => {
    const newTaskTemplateIds = this.state.taskTemplateIds.slice();
    const taskTemplateIdIndex = newTaskTemplateIds.indexOf(taskTemplateId);
    const alreadySelected = taskTemplateIdIndex > -1;

    if (alreadySelected) {
      newTaskTemplateIds.splice(taskTemplateIdIndex, 1);
    } else {
      newTaskTemplateIds.push(taskTemplateId);
    }

    this.setState({ taskTemplateIds: newTaskTemplateIds });
  };

  render(): JSX.Element {
    const {
      suggestion,
      onAccept,
      onDismiss,
      toggleSelectedGoalSuggestionId,
      selectedGoalSuggestionId,
    } = this.props;

    const isGoalSelected = selectedGoalSuggestionId === suggestion.id;

    const conatinerStyles = classNames(styles.container, {
      [styles.opaque]: !!selectedGoalSuggestionId && !isGoalSelected,
      [styles.shadow]: !!selectedGoalSuggestionId && isGoalSelected,
    });

    const taskTemplates =
      selectedGoalSuggestionId === suggestion.id
        ? suggestion.goalSuggestionTemplate!.taskTemplates.map(template => {
            return (
              <TaskTemplate
                key={template.id}
                taskTemplate={template}
                selected={this.state.taskTemplateIds.includes(template.id)}
                onToggle={this.onToggleTaskTemplate}
              />
            );
          })
        : null;

    return (
      <div
        className={conatinerStyles}
        onClick={() => toggleSelectedGoalSuggestionId(suggestion.id)}
      >
        <CarePlanSuggestion
          suggestion={suggestion}
          onAccept={() => onAccept(suggestion, this.state.taskTemplateIds)}
          onDismiss={() => onDismiss(suggestion)}
          hideButtons={!isGoalSelected}
        />
        {taskTemplates}
      </div>
    );
  }
}

export default GoalSuggestion;
