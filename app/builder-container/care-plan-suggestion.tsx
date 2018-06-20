import classNames from 'classnames';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import concernSuggestionDeleteGraphql from '../graphql/queries/concern-suggestion-delete-mutation.graphql';
import goalSuggestionDeleteGraphql from '../graphql/queries/goal-suggestion-delete-mutation.graphql';
import {
  concernSuggestionCreate,
  concernSuggestionDeleteVariables,
  goalSuggestionCreate,
  goalSuggestionDeleteVariables,
  FullConcern,
  FullGoalSuggestionTemplate,
} from '../graphql/types';
import styles from '../shared/css/two-panel-right.css';
import Icon from '../shared/library/icon/icon';
import withErrorHandler, {
  IInjectedErrorProps,
} from '../shared/with-error-handler/with-error-handler';

interface IProps {
  answerId?: string | null;
  screeningToolScoreRangeId?: string | null;
  suggestionType: 'concern' | 'goal';
  suggestion: FullGoalSuggestionTemplate | FullConcern;
}

interface IGraphqlProps {
  deleteConcernSuggestion: (
    options: { variables: concernSuggestionDeleteVariables },
  ) => { data: concernSuggestionCreate };
  deleteGoalSuggestion: (
    options: { variables: goalSuggestionDeleteVariables },
  ) => { data: goalSuggestionCreate };
}

interface IState {
  loading: boolean;
}

type allProps = IProps & IGraphqlProps & IInjectedErrorProps;

class CarePlanSuggestion extends React.Component<allProps, IState> {
  state = { loading: false };

  onClickDelete = async () => {
    const {
      suggestionType,
      suggestion,
      answerId,
      screeningToolScoreRangeId,
      deleteConcernSuggestion,
      deleteGoalSuggestion,
      openErrorPopup,
    } = this.props;

    this.setState({ loading: true });

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

      this.setState({ loading: false });
    } catch (err) {
      openErrorPopup(err.message);
    }
  };

  renderGoalTaskTemplates(goalSuggestion: FullGoalSuggestionTemplate) {
    return (goalSuggestion.taskTemplates || []).map(taskTemplate => {
      if (taskTemplate) {
        return <li key={taskTemplate.id}>{taskTemplate.title}</li>;
      }
    });
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
            {this.renderGoalTaskTemplates(suggestion as FullGoalSuggestionTemplate)}
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
  withErrorHandler(),
  graphql(concernSuggestionDeleteGraphql, {
    name: 'deleteConcernSuggestion',
    options: {
      refetchQueries: ['getQuestions', 'getScreeningTools'],
    },
  }),
  graphql(goalSuggestionDeleteGraphql, {
    name: 'deleteGoalSuggestion',
    options: {
      refetchQueries: ['getQuestions', 'getScreeningTools'],
    },
  }),
)(CarePlanSuggestion) as React.ComponentClass<IProps>;
