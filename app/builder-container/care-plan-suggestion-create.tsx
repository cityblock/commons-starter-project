import React from 'react';
import { compose, graphql } from 'react-apollo';
import concernSuggestionCreateMutationGraphql from '../graphql/queries/concern-suggestion-create-mutation.graphql';
import concernsQuery from '../graphql/queries/get-concerns.graphql';
import goalsQuery from '../graphql/queries/get-goal-suggestion-templates.graphql';
import goalSuggestionCreateMutationGraphql from '../graphql/queries/goal-suggestion-create-mutation.graphql';
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
import loadingStyles from '../shared/css/loading-spinner.css';
import carePlanSuggestionStyles from '../shared/css/two-panel-right.css';
import Button from '../shared/library/button/button';
import Option from '../shared/library/option/option';
import Select from '../shared/library/select/select';
import withErrorHandler, {
  IInjectedErrorProps,
} from '../shared/with-error-handler/with-error-handler';
import styles from './css/risk-area-create.css';

interface IProps {
  goals: FullGoalSuggestionTemplateFragment[] | null;
  goalsError?: string | null;
  concerns: FullConcernFragment[] | null;
  concernsError?: string | null;
  answer: FullAnswerFragment | null;
  screeningToolScoreRange: FullScreeningToolScoreRangeFragment | null;
}

interface IGraphqlProps {
  createConcernSuggestion?: (
    options: { variables: concernSuggestionCreateMutationVariables },
  ) => { data: concernSuggestionCreateMutation };
  createGoalSuggestion?: (
    options: { variables: goalSuggestionCreateMutationVariables },
  ) => { data: goalSuggestionCreateMutation };
}

type SuggestionType = 'concern' | 'goal';
interface IState {
  suggestionType: SuggestionType | null;
  suggestionId: string | null;
  loading: boolean;
}

type allProps = IProps & IGraphqlProps & IInjectedErrorProps;

export class CarePlanSuggestionCreate extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.renderMetadata = this.renderMetadata.bind(this);
    this.onUpdateSuggestionType = this.onUpdateSuggestionType.bind(this);
    this.getGoalOptions = this.getGoalOptions.bind(this);
    this.getConcernOptions = this.getConcernOptions.bind(this);

    this.state = { loading: false, suggestionType: null, suggestionId: null };
  }

  componentDidUpdate(prevProps: allProps) {
    const { goalsError, concernsError, openErrorPopup } = this.props;

    if (goalsError && goalsError !== prevProps.goalsError) {
      openErrorPopup(goalsError);
    } else if (concernsError && concernsError !== prevProps.concernsError) {
      openErrorPopup(concernsError);
    }
  }

  onUpdateSuggestionType(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value;
    this.setState({ suggestionType: value as SuggestionType });
  }

  onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value;
    this.setState({ suggestionId: value });
  }

  async onSubmit() {
    const { suggestionType, suggestionId } = this.state;
    const {
      createGoalSuggestion,
      createConcernSuggestion,
      answer,
      screeningToolScoreRange,
      openErrorPopup,
    } = this.props;

    this.setState({ loading: true });

    try {
      if (suggestionType === 'concern' && suggestionId && createConcernSuggestion) {
        await createConcernSuggestion({
          variables: {
            answerId: answer ? answer.id : null,
            screeningToolScoreRangeId: screeningToolScoreRange ? screeningToolScoreRange.id : null,
            concernId: suggestionId,
          },
        });
      } else if (suggestionType === 'goal' && suggestionId && createGoalSuggestion) {
        await createGoalSuggestion({
          variables: {
            answerId: answer ? answer.id : null,
            screeningToolScoreRangeId: screeningToolScoreRange ? screeningToolScoreRange.id : null,
            goalSuggestionTemplateId: suggestionId,
          },
        });
      }
      this.setState({
        loading: false,
        suggestionType: null,
        suggestionId: null,
      });
    } catch (err) {
      openErrorPopup(err.message);
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

    return (goals || [])
      .filter(goal => existingGoalIds.indexOf(goal.id) === -1)
      .map(goal => <Option key={goal.id} value={goal.id} label={goal.title} />);
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
      .map(concern => <Option key={concern.id} value={concern.id} label={concern.title} />);
  }

  render() {
    const { loading, suggestionType, suggestionId } = this.state;
    const loadingClass = loading ? styles.loading : styles.loadingHidden;

    const suggestionOptions =
      suggestionType === 'concern' ? this.getConcernOptions() : this.getGoalOptions();
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
          <Select name="suggestionId" value={suggestionId || ''} onChange={this.onChange}>
            <Option value="" disabled label="Select a suggestion" />
            {suggestionOptions}
          </Select>
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
          <Select
            name="suggestionType"
            value={suggestionType || ''}
            onChange={this.onUpdateSuggestionType}
          >
            <Option value="" disabled label="Select a type" />
            <Option value="concern" label="Concern" />
            <Option value="goal" label="Goal/Tasks" />
          </Select>
        </div>
        {secondaryDropdownHtml}
        {this.renderMetadata()}
        <div className={styles.formBottom}>
          <div className={styles.formBottomContent}>
            <Button onClick={this.onSubmit} label={'Add care plan suggestion'} />
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withErrorHandler(),
  graphql(concernsQuery, {
    props: ({ data }) => ({
      concernsLoading: data ? data.loading : false,
      concernsError: data && data.error ? data.error.message : null,
      concerns: data ? (data as any).concerns : null,
    }),
  }),
  graphql(goalsQuery, {
    props: ({ data }) => ({
      refetchGoals: data ? data.refetch : null,
      goalsLoading: data ? data.loading : false,
      goalsError: data && data.error ? data.error.message : null,
      goals: data ? (data as any).goalSuggestionTemplates : null,
    }),
  }),
  graphql(concernSuggestionCreateMutationGraphql, {
    name: 'createConcernSuggestion',
    options: {
      refetchQueries: ['getQuestions', 'getScreeningTools'],
    },
  }),
  graphql(goalSuggestionCreateMutationGraphql, {
    name: 'createGoalSuggestion',
    options: {
      refetchQueries: ['getQuestions', 'getScreeningTools'],
    },
  }),
)(CarePlanSuggestionCreate) as React.ComponentClass<IProps>;
