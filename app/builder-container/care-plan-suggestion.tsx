import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as concernSuggestionDeleteMutationGraphql from '../graphql/queries/concern-suggestion-delete-mutation.graphql';
import * as goalSuggestionDeleteMutationGraphql from '../graphql/queries/goal-suggestion-delete-mutation.graphql';
import {
  concernSuggestionCreateMutation,
  concernSuggestionDeleteMutationVariables,
  goalSuggestionCreateMutation,
  goalSuggestionDeleteMutationVariables,
  FullConcernFragment,
  FullGoalSuggestionTemplateFragment,
} from '../graphql/types';
import * as styles from '../shared/css/two-panel-right.css';
import Icon from '../shared/library/icon/icon';

interface IProps {
  answerId: string | null;
  screeningToolScoreRangeId: string | null;
  suggestionType: 'concern' | 'goal';
  suggestion: FullGoalSuggestionTemplateFragment | FullConcernFragment;
  mutate?: any;
}

interface IGraphqlProps {
  deleteConcernSuggestion: (
    options: { variables: concernSuggestionDeleteMutationVariables },
  ) => { data: concernSuggestionCreateMutation };
  deleteGoalSuggestion: (
    options: { variables: goalSuggestionDeleteMutationVariables },
  ) => { data: goalSuggestionCreateMutation };
}

interface IState {
  loading: boolean;
  error: string | null;
}

type allProps = IProps & IGraphqlProps;

class CarePlanSuggestion extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.onClickDelete = this.onClickDelete.bind(this);
    this.renderGoalSuggestion = this.renderGoalSuggestion.bind(this);
    this.renderConcernSuggestion = this.renderConcernSuggestion.bind(this);
    this.renderGoalTaskTemplates = this.renderGoalTaskTemplates.bind(this);

    this.state = { loading: false, error: null };
  }

  async onClickDelete() {
    const {
      suggestionType,
      suggestion,
      answerId,
      screeningToolScoreRangeId,
      deleteConcernSuggestion,
      deleteGoalSuggestion,
    } = this.props;

    this.setState({ loading: true, error: null });

    try {
      if (suggestionType === 'concern') {
        await deleteConcernSuggestion({
          variables: { answerId, screeningToolScoreRangeId, concernId: suggestion.id },
        });
      } else if (suggestionType === 'goal') {
        await deleteGoalSuggestion({
          variables: {
            answerId,
            screeningToolScoreRangeId,
            goalSuggestionTemplateId: suggestion.id,
          },
        });
      }

      this.setState({ loading: false, error: null });
    } catch (err) {
      this.setState({ loading: false, error: err.message });
    }
  }

  renderGoalTaskTemplates(goalSuggestion: FullGoalSuggestionTemplateFragment) {
    return (goalSuggestion.taskTemplates || [])
      .map(taskTemplate => {
        if (taskTemplate) {
          return <li key={taskTemplate.id}>{taskTemplate.title}</li>;
        }
      })
      .filter(li => !!li); // Really not sure why taskTemplate can be null
  }

  renderGoalSuggestion() {
    const { suggestionType, suggestion } = this.props;

    const suggestionStyles = classNames(styles.smallText, styles.smallMargin);

    if (suggestionType === 'goal') {
      return (
        <div className={suggestionStyles}>
          <div className={styles.flexRow}>
            <Icon name="close" onClick={this.onClickDelete} />
            <div>{suggestion.title}</div>
          </div>
          <ul className={styles.smallMarginPadding}>
            {this.renderGoalTaskTemplates(suggestion as FullGoalSuggestionTemplateFragment)}
          </ul>
        </div>
      );
    }
  }

  renderConcernSuggestion() {
    const { suggestionType, suggestion } = this.props;

    const suggestionStyles = classNames(styles.smallText, styles.smallMargin);

    if (suggestionType === 'concern') {
      return (
        <div className={suggestionStyles}>
          <div className={styles.flexRow}>
            <Icon name="close" onClick={this.onClickDelete} />
            <div>{suggestion.title}</div>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        {this.renderGoalSuggestion()}
        {this.renderConcernSuggestion()}
      </div>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(concernSuggestionDeleteMutationGraphql as any, {
    name: 'deleteConcernSuggestion',
    options: {
      refetchQueries: ['getQuestions', 'getScreeningTools'],
    },
  }),
  graphql<IGraphqlProps, IProps, allProps>(goalSuggestionDeleteMutationGraphql as any, {
    name: 'deleteGoalSuggestion',
    options: {
      refetchQueries: ['getQuestions', 'getScreeningTools'],
    },
  }),
)(CarePlanSuggestion);
