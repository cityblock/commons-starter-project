import * as classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import { DATETIME_FORMAT } from '../config';
import { FullCarePlanSuggestionFragment, FullUserFragment } from '../graphql/types';
import * as styles from './css/patient-care-plan.css';
import TaskTemplate from './task-template';

export interface IProps {
  suggestion: FullCarePlanSuggestionFragment;
  careTeam?: FullUserFragment[];
  onAccept: (suggestion: FullCarePlanSuggestionFragment, taskTemplateIds?: string[]) => any;
  onDismiss: (suggestion: FullCarePlanSuggestionFragment) => any;
}

export interface IState {
  selectedTaskTemplateIds: string[];
}

export default class PatientCarePlanSuggestion extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const { suggestion } = props;
    const { suggestionType } = suggestion;

    let selectedTaskTemplateIds: string[] = [];

    this.onToggleTaskTemplateRemoval = this.onToggleTaskTemplateRemoval.bind(this);
    this.displayTitle = this.displayTitle.bind(this);
    this.renderTaskTemplatesHtml = this.renderTaskTemplatesHtml.bind(this);

    if (suggestionType === 'goal' && suggestion.goalSuggestionTemplate) {
      selectedTaskTemplateIds = (suggestion.goalSuggestionTemplate.taskTemplates || [])
          .map(taskTemplate => taskTemplate!.id);
    }

    this.onAccept = this.onAccept.bind(this);

    this.state = { selectedTaskTemplateIds };
  }

  onToggleTaskTemplateRemoval(taskTemplateId: string) {
    const { selectedTaskTemplateIds } = this.state;

    const taskTemplateIdIndex = selectedTaskTemplateIds.indexOf(taskTemplateId);
    const alreadySelected = taskTemplateIdIndex > -1;

    if (alreadySelected) {
      selectedTaskTemplateIds.splice(taskTemplateIdIndex, 1);
    } else {
      selectedTaskTemplateIds.push(taskTemplateId);
    }

    this.setState(() => ({ selectedTaskTemplateIds }));
  }

  onAccept() {
    const { onAccept, suggestion } = this.props;
    const { suggestionType } = suggestion;
    const { selectedTaskTemplateIds } = this.state;

    if (suggestionType === 'goal') {
      onAccept(suggestion, selectedTaskTemplateIds);
    } else {
      onAccept(suggestion);
    }
  }

  displayTitle() {
    const { suggestion } = this.props;
    const { concern, goalSuggestionTemplate } = suggestion;

    if (goalSuggestionTemplate) {
      return goalSuggestionTemplate.title;
    } else if (concern) {
      return concern.title;
    } else {
      return '';
    }
  }

  renderTaskTemplatesHtml() {
    const { careTeam, suggestion } = this.props;
    const { selectedTaskTemplateIds } = this.state;
    const { goalSuggestionTemplate } = suggestion;

    if (goalSuggestionTemplate && goalSuggestionTemplate.taskTemplates) {
      return goalSuggestionTemplate.taskTemplates
        .map(taskTemplate => {
          const selected = selectedTaskTemplateIds.indexOf(taskTemplate!.id) > -1;

          return (
            <TaskTemplate
              key={taskTemplate!.id}
              taskTemplate={taskTemplate!}
              selected={selected}
              careTeam={careTeam}
              onToggleRemoved={this.onToggleTaskTemplateRemoval} />
          );
        });
    }
  }

  render() {
    const { suggestion, onDismiss } = this.props;
    const { suggestionType, goalSuggestionTemplate } = suggestion;

    const titleStyle = classNames({
      [styles.carePlanSuggestionConcernTitle]: suggestionType === 'concern',
      [styles.carePlanSuggestionGoalTitle]: suggestionType === 'goal',
    });
    const metaRowStyles = classNames(styles.carePlanSuggestionMetaRow, {
      [styles.largerMargin]: !!goalSuggestionTemplate &&
        !!(goalSuggestionTemplate.taskTemplates || []).length,
    });
    const suggestionLabelText = `Suggested ${suggestionType}`;

    return (
      <div className={styles.carePlanSuggestion}>
        <div className={styles.carePlanSuggestionType}>{suggestionLabelText}</div>
        <div className={styles.carePlanSuggestionTitleRow}>
          <div className={titleStyle}>{this.displayTitle()}</div>
          <div className={styles.carePlanSuggestionActionButtons}>
            <div
              className={styles.rejectButton}
              onClick={() => onDismiss(suggestion)}></div>
            <div
              className={styles.acceptButton}
              onClick={this.onAccept}>
            </div>
          </div>
        </div>
        <div className={metaRowStyles}>
          <div className={styles.carePlanSuggestionSmallLabel}>Suggested:</div>
          <div className={styles.carePlanSuggestionSmallDate}>
            {moment(suggestion.createdAt, DATETIME_FORMAT).format('MMM D, YYYY')}
          </div>
        </div>
        {this.renderTaskTemplatesHtml()}
      </div>
    );
  }
}
