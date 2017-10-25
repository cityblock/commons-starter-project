import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
/* tslint:disable:max-line-length */
import * as concernSuggestionCreateMutationGraphql from '../graphql/queries/concern-suggestion-create-mutation.graphql';
import * as concernsQuery from '../graphql/queries/get-concerns.graphql';
import * as goalsQuery from '../graphql/queries/get-goal-suggestion-templates.graphql';
import * as goalSuggestionCreateMutationGraphql from '../graphql/queries/goal-suggestion-create-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  concernSuggestionCreateMutation,
  concernSuggestionCreateMutationVariables,
  goalSuggestionCreateMutation,
  goalSuggestionCreateMutationVariables,
  FullAnswerFragment,
  FullConcernFragment,
  FullGoalSuggestionTemplateFragment,
  FullScreeningToolScoreRangeFragment,
} from '../graphql/types';
import * as formStyles from '../shared/css/forms.css';
import * as loadingStyles from '../shared/css/loading-spinner.css';
import * as carePlanSuggestionStyles from '../shared/css/two-panel-right.css';
import * as styles from './css/risk-area-create.css';

interface IProps {
  goals?: FullGoalSuggestionTemplateFragment[];
  concerns?: FullConcernFragment[];
  answer?: FullAnswerFragment;
  screeningToolScoreRange?: FullScreeningToolScoreRangeFragment;
}

interface IGraphqlProps {
  createConcernSuggestion?: (
    options: { variables: concernSuggestionCreateMutationVariables },
  ) => { data: concernSuggestionCreateMutation };
  createGoalSuggestion?: (
    options: { variables: goalSuggestionCreateMutationVariables },
  ) => { data: goalSuggestionCreateMutation };
}

interface IState {
  suggestionType?: 'concern' | 'goal';
  suggestionId?: string;
  loading: boolean;
  error?: string;
}

type allProps = IProps & IGraphqlProps;

export class CarePlanSuggestionCreate extends React.Component<allProps, IState> {
  constructor(props: allProps) {
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
    const {
      createGoalSuggestion,
      createConcernSuggestion,
      answer,
      screeningToolScoreRange,
    } = this.props;

    this.setState(() => ({ loading: true, error: undefined }));

    try {
      if (suggestionType === 'concern' && suggestionId && createConcernSuggestion) {
        await createConcernSuggestion({
          variables: {
            answerId: answer ? answer.id : undefined,
            screeningToolScoreRangeId: screeningToolScoreRange
              ? screeningToolScoreRange.id
              : undefined,
            concernId: suggestionId,
          },
        });
      } else if (suggestionType === 'goal' && suggestionId && createGoalSuggestion) {
        await createGoalSuggestion({
          variables: {
            answerId: answer ? answer.id : undefined,
            screeningToolScoreRangeId: screeningToolScoreRange
              ? screeningToolScoreRange.id
              : undefined,
            goalSuggestionTemplateId: suggestionId,
          },
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
      const taskTemplatesHtml = goal.taskTemplates
        ? goal.taskTemplates
            .map(taskTemplate => {
              if (taskTemplate) {
                return <li key={taskTemplate.id}>{taskTemplate.title}</li>;
              }
            })
            .filter(li => !!li)
        : null;

      return (
        <div className={carePlanSuggestionStyles.smallText}>
          Tasks in this goal:
          <ul className={carePlanSuggestionStyles.extraSmallMarginPadding}>{taskTemplatesHtml}</ul>
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
    const { goals, answer, screeningToolScoreRange } = this.props;
    let existingGoalIds: any[] = [];

    if (answer) {
      existingGoalIds = (answer.goalSuggestions || [])
        .map(goal => (goal ? goal.id : null))
        .filter(id => !!id);
    } else if (screeningToolScoreRange) {
      existingGoalIds = (screeningToolScoreRange.goalSuggestions || [])
        .map(goal => (goal ? goal.id : null))
        .filter(id => !!id);
    }

    return (goals || []).filter(goal => existingGoalIds.indexOf(goal.id) === -1).map(goal => (
      <option key={goal.id} value={goal.id}>
        {goal.title}
      </option>
    ));
  }

  getConcernOptions() {
    const { concerns, answer, screeningToolScoreRange } = this.props;
    let existingConcernIds: any[] = [];

    if (answer) {
      existingConcernIds = (answer.concernSuggestions || [])
        .map(concern => (concern ? concern.id : null))
        .filter(id => !!id);
    } else if (screeningToolScoreRange) {
      existingConcernIds = (screeningToolScoreRange.concernSuggestions || [])
        .map(concern => (concern ? concern.id : null))
        .filter(id => !!id);
    }

    return (concerns || [])
      .filter(concern => existingConcernIds.indexOf(concern.id) === -1)
      .map(concern => (
        <option key={concern.id} value={concern.id}>
          {concern.title}
        </option>
      ));
  }

  render() {
    const { loading, suggestionType, suggestionId } = this.state;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;

    const goalOptions = this.getGoalOptions();
    const concernOptions = this.getConcernOptions();
    const suggestionOptions = suggestionType === 'concern' ? concernOptions : goalOptions;
    let secondaryDropdownHtml = null;

    if (!!suggestionType && !suggestionOptions.length) {
      secondaryDropdownHtml = (
        <div className={carePlanSuggestionStyles.smallText}>
          No available {suggestionType} suggestions
        </div>
      );
    } else if (!!suggestionType) {
      secondaryDropdownHtml = (
        <div className={styles.flexInputGroup}>
          <select
            name="suggestionId"
            value={suggestionId || ''}
            onChange={this.onChange}
            className={classNames(formStyles.select, formStyles.inputSmall, styles.flexInputItem)}
          >
            <option value="" disabled hidden>
              Select a suggestion
            </option>
            {suggestionOptions}
          </select>
        </div>
      );
    }
    return (
      <div className={carePlanSuggestionStyles.borderContainer}>
        <div className={loadingClass}>
          <div className={styles.loadingContainer}>
            <div className={loadingStyles.loadingSpinner} />
          </div>
        </div>
        <div className={styles.flexInputGroup}>
          <select
            name="suggestionType"
            value={suggestionType || ''}
            onChange={this.onUpdateSuggestionType}
            className={classNames(formStyles.select, formStyles.inputSmall, styles.flexInputItem)}
          >
            <option value="" disabled hidden>
              Select a type
            </option>
            <option value="concern">Concern</option>
            <option value="goal">Goal/Tasks</option>
          </select>
        </div>
        {secondaryDropdownHtml}
        {this.renderMetadata()}
        <div className={styles.formBottom}>
          <div className={styles.formBottomContent}>
            <input
              type="submit"
              onClick={this.onClick}
              className={styles.submitButton}
              value={'Add care plan suggestion'}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps>(concernsQuery as any, {
    props: ({ data }) => ({
      concernsLoading: data ? data.loading : false,
      concernsError: data ? data.error : null,
      concerns: data ? (data as any).concerns : null,
    }),
  }),
  graphql<IGraphqlProps, IProps>(goalsQuery as any, {
    props: ({ data }) => ({
      refetchGoals: data ? data.refetch : null,
      goalsLoading: data ? data.loading : false,
      goalsError: data ? data.error : null,
      goals: data ? (data as any).goalSuggestionTemplates : null,
    }),
  }),
  graphql<IGraphqlProps, IProps>(concernSuggestionCreateMutationGraphql as any, {
    name: 'createConcernSuggestion',
    options: {
      refetchQueries: ['getQuestionsForRiskAreaOrScreeningTool', 'getScreeningTools'],
    },
  }),
  graphql<IGraphqlProps, IProps>(goalSuggestionCreateMutationGraphql as any, {
    name: 'createGoalSuggestion',
    options: {
      refetchQueries: ['getQuestionsForRiskAreaOrScreeningTool', 'getScreeningTools'],
    },
  }),
)(CarePlanSuggestionCreate);
