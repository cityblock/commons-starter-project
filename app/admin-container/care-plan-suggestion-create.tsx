import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
/* tslint:disable:max-line-length */
import * as concernSuggestionCreateMutation from '../graphql/queries/concern-suggestion-create-mutation.graphql';
import * as concernsQuery from '../graphql/queries/get-concerns.graphql';
import * as goalsQuery from '../graphql/queries/get-goal-suggestion-templates.graphql';
import * as goalSuggestionCreateMutation from '../graphql/queries/goal-suggestion-create-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  concernSuggestionCreateMutationVariables,
  goalSuggestionCreateMutationVariables,
  FullAnswerFragment,
  FullConcernFragment,
  FullGoalSuggestionTemplateFragment,
} from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import * as styles from './css/risk-area-create.css';
import * as carePlanSuggestionStyles from './css/two-panel-right.css';

export interface IProps {
  goals?: FullGoalSuggestionTemplateFragment[];
  concerns?: FullConcernFragment[];
  answer: FullAnswerFragment;
  createConcernSuggestion: (
    options: { variables: concernSuggestionCreateMutationVariables },
  ) => { data: { concernSuggestionCreate: FullConcernFragment } };
  createGoalSuggestion: (
    options: { variables: goalSuggestionCreateMutationVariables },
  ) => { data: { goalSuggestionCreate: FullGoalSuggestionTemplateFragment } };
}

export interface IState {
  suggestionType?: 'concern' | 'goal';
  suggestionId?: string;
  loading: boolean;
  error?: string;
}

class CarePlanSuggestionCreate extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.renderMetadata = this.renderMetadata.bind(this);
    this.onUpdateSuggestionType = this.onUpdateSuggestionType.bind(this);
    this.getGoalOptions = this.getGoalOptions.bind(this);
    this.getConcernOptions = this.getConcernOptions.bind(this);

    this.state = { loading: false };
  }

  onUpdateSuggestionType(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value;
    this.setState(() => ({ suggestionType: value }));
  }

  onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value;
    this.setState(() => ({ suggestionId: value }));
  }

  async onClick(event: React.MouseEvent<HTMLInputElement>) {
    event.preventDefault();

    const { suggestionType, suggestionId } = this.state;
    const { createGoalSuggestion, createConcernSuggestion, answer } = this.props;

    this.setState(() => ({ loading: true, error: undefined }));

    try {
      if (suggestionType === 'concern' && suggestionId) {
        await createConcernSuggestion({
          variables: { answerId: answer.id, concernId: suggestionId },
        });
      } else if (suggestionType === 'goal' && suggestionId) {
        await createGoalSuggestion({
          variables: { answerId: answer.id, goalSuggestionTemplateId: suggestionId },
        });
      }
      this.setState(() => ({
        loading: false,
        error: undefined,
        suggestionType: undefined,
        suggestionId: undefined,
      }));
    } catch (err) {
      this.setState(() => ({ loading: false, error: err.message }));
    }
  }

  renderTaskTemplates(goal?: FullGoalSuggestionTemplateFragment) {
    if (goal) {
      const taskTemplatesHtml = goal.taskTemplates ?
        goal.taskTemplates.map(taskTemplate => {
          if (taskTemplate) {
            return <li key={taskTemplate.id}>{taskTemplate.title}</li>;
          }
        }).filter(li => !!li) : null;

      return (
        <div className={carePlanSuggestionStyles.smallText}>
          Tasks in this goal:
          <ul className={carePlanSuggestionStyles.extraSmallMarginPadding}>
            {taskTemplatesHtml}
          </ul>
        </div>
      );
    }
  }

  renderMetadata() {
    const { suggestionType, suggestionId } = this.state;
    const { goals } = this.props;

    if (suggestionType === 'goal' && suggestionId && goals && goals.length) {
      const fetchedGoal = goals.find(goal => goal.id === suggestionId);

      return this.renderTaskTemplates(fetchedGoal);
    }
  }

  getGoalOptions() {
    const { goals, answer } = this.props;

    const existingGoalIds = (answer.goalSuggestions || [])
      .map(goal => goal ? goal.id : null)
      .filter(id => !!id);

    return (goals || [])
      .filter(goal => existingGoalIds.indexOf(goal.id) === -1)
      .map(goal => (
        <option key={goal.id} value={goal.id}>{goal.title}</option>
      ));
  }

  getConcernOptions() {
    const { concerns, answer } = this.props;

    const existingConcernIds = (answer.concernSuggestions || [])
      .map(concern => concern ? concern.id : null)
      .filter(id => !!id);

    return (concerns || [])
      .filter(concern => existingConcernIds.indexOf(concern.id) === -1)
      .map(concern => (
        <option key={concern.id} value={concern.id}>{concern.title}</option>
      ));
  }

  render() {
    const { loading, suggestionType, suggestionId } = this.state;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;

    const goalOptions = this.getGoalOptions();
    const concernOptions = this.getConcernOptions();
    const suggestionOptions = suggestionType === 'concern' ?
      concernOptions : goalOptions;
    let secondaryDropdownHtml = null;

    if (!!suggestionType && !suggestionOptions.length) {
      secondaryDropdownHtml = (
        <div
          className={carePlanSuggestionStyles.smallText}>
          No available {suggestionType} suggestions
        </div>
      );
    } else if (!!suggestionType) {
      secondaryDropdownHtml = (
        <div className={styles.flexInputGroup}>
          <select
            name='suggestionId'
            value={suggestionId || ''}
            onChange={this.onChange}
            className={
              classNames(formStyles.select, formStyles.inputSmall, styles.flexInputItem)}>
            <option value='' disabled hidden>Select a suggestion</option>
            {suggestionOptions}
          </select>
        </div>
      );
    }
    return (
      <div className={carePlanSuggestionStyles.borderContainer}>
        <div className={loadingClass}>
          <div className={styles.loadingContainer}>
            <div className={loadingStyles.loadingSpinner}></div>
          </div>
        </div>
        <div className={styles.flexInputGroup}>
          <select
            name='suggestionType'
            value={suggestionType || ''}
            onChange={this.onUpdateSuggestionType}
            className={
              classNames(formStyles.select, formStyles.inputSmall, styles.flexInputItem)}>
            <option value='' disabled hidden>Select a type</option>
            <option value='concern'>Concern</option>
            <option value='goal'>Goal/Tasks</option>
          </select>
        </div>
        {secondaryDropdownHtml}
        {this.renderMetadata()}
        <div className={styles.formBottom}>
          <div className={styles.formBottomContent}>
            <input
              type='submit'
              onClick={this.onClick}
              className={styles.submitButton}
              value={'Add care plan suggestion'} />
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(concernsQuery as any, {
    props: ({ data }) => ({
      concernsLoading: (data ? data.loading : false),
      concernsError: (data ? data.error : null),
      concerns: (data ? (data as any).concerns : null),
    }),
  }),
  graphql(goalsQuery as any, {
    props: ({ data }) => ({
      refetchGoals: (data ? data.refetch : null),
      goalsLoading: (data ? data.loading : false),
      goalsError: (data ? data.error : null),
      goals: (data ? (data as any).goalSuggestionTemplates : null),
    }),
  }),
  graphql(concernSuggestionCreateMutation as any, {
    name: 'createConcernSuggestion',
    options: {
      refetchQueries: [
        'getQuestionsForRiskArea',
      ],
    },
  }),
  graphql(goalSuggestionCreateMutation as any, {
    name: 'createGoalSuggestion',
    options: {
      refetchQueries: [
        'getQuestionsForRiskArea',
      ],
    },
  }),
)(CarePlanSuggestionCreate as any) as any;
