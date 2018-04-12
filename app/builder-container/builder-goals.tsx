import * as classNames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import * as goalsQuery from '../graphql/queries/get-goal-suggestion-templates.graphql';
import * as goalDeleteMutation from '../graphql/queries/goal-suggestion-template-delete-mutation.graphql';
import {
  getGoalSuggestionTemplatesQuery,
  goalSuggestionTemplateDeleteMutation,
  goalSuggestionTemplateDeleteMutationVariables,
  FullGoalSuggestionTemplateFragment,
} from '../graphql/types';
import * as styles from '../shared/css/two-panel.css';
import Button from '../shared/library/button/button';
import { IState as IAppState } from '../store';
import Goal from './goal';
import GoalCreate from './goal-create';
import { GoalRow } from './goal-row';

interface IProps {
  mutate?: any;
  match: {
    params: {
      goalId: string | null;
    };
  };
  history: History;
}

interface IStateProps {
  goalId: string | null;
  routeBase: string;
}

interface IGraphqlProps {
  refetchGoals: () => any;
  goals?: getGoalSuggestionTemplatesQuery['goalSuggestionTemplates'];
  loading: boolean;
  error: string | null;
  deleteGoal?: (
    options: { variables: goalSuggestionTemplateDeleteMutationVariables },
  ) => { data: goalSuggestionTemplateDeleteMutation };
}

type allProps = IProps & IGraphqlProps & IStateProps;

interface IState {
  showCreateGoal: boolean;
  loading: boolean;
  error: string | null;
}

export class BuilderGoals extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = {
      showCreateGoal: false,
      loading: false,
      error: null,
    };
  }

  componentWillReceiveProps(nextProps: allProps) {
    const { loading, error, goalId } = nextProps;
    this.setState({ loading, error });
    if (goalId && goalId !== this.props.goalId) {
      this.props.refetchGoals();
    }
  }

  showCreateGoal = () => {
    this.setState({ showCreateGoal: true });
  };

  hideCreateGoal = (goal?: FullGoalSuggestionTemplateFragment) => {
    this.setState({ showCreateGoal: false });
  };

  renderGoals = (goals: getGoalSuggestionTemplatesQuery['goalSuggestionTemplates']) => {
    const { loading, error } = this.props;
    const validGoals = (goals || []).filter(
      goal => goal && !goal.deletedAt,
    ) as FullGoalSuggestionTemplateFragment[];

    if (validGoals.length > 0) {
      return validGoals.map(this.renderGoal);
    } else if (!loading && !error) {
      return (
        <div className={styles.emptyMessage}>
          <div className={styles.emptyLogo} />
          <div className={styles.emptyLabel}>No Goals</div>
        </div>
      );
    }
  };

  renderGoal = (goal: FullGoalSuggestionTemplateFragment) => {
    const selected = goal.id === this.props.goalId;
    return (
      <GoalRow key={goal.id} goal={goal} selected={selected} routeBase={this.props.routeBase} />
    );
  };

  onDeleteGoal = async (goalId: string) => {
    const { history, routeBase, deleteGoal } = this.props;
    if (deleteGoal) {
      await deleteGoal({ variables: { goalSuggestionTemplateId: goalId } });
    }

    history.push(routeBase);
  };

  render() {
    const { goals, routeBase, goalId } = this.props;
    const { showCreateGoal } = this.state;
    const goalsList = goals || [];
    const goalContainerStyles = classNames(styles.itemContainer, {
      [styles.visible]: !!goalId || showCreateGoal,
    });
    const goalListStyles = classNames(styles.itemsList, {
      [styles.compressed]: !!goalId || showCreateGoal,
    });
    const createGoalButton = (
      <div className={styles.createContainer}>
        <Button onClick={this.showCreateGoal} messageId="builder.createGoal" />
      </div>
    );
    const createGoalHtml = showCreateGoal ? (
      <GoalCreate onClose={this.hideCreateGoal} routeBase={this.props.routeBase} />
    ) : null;
    const renderedGoal = (props: any) => (
      <Goal goals={goals} routeBase={routeBase} onDelete={this.onDeleteGoal} {...props} />
    );
    const goalHtml = showCreateGoal ? null : (
      <Route path={`${routeBase}/:objectId`} render={renderedGoal} />
    );
    return (
      <div className={styles.container}>
        <div className={styles.sortSearchBar}>{createGoalButton}</div>
        <div className={styles.bottomContainer}>
          <div className={goalListStyles}>{this.renderGoals(goalsList)}</div>
          <div className={goalContainerStyles}>
            {goalHtml}
            {createGoalHtml}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): IStateProps {
  return {
    goalId: ownProps.match.params.goalId,
    routeBase: '/builder/goals',
  };
}

export default compose(
  withRouter,
  connect<IStateProps, {}, allProps>(mapStateToProps as (args?: any) => IStateProps),
  graphql<IGraphqlProps, IProps, allProps>(goalDeleteMutation as any, { name: 'deleteGoal' }),
  graphql<IGraphqlProps, IProps, allProps>(goalsQuery as any, {
    props: ({ data }) => ({
      refetchGoals: data ? data.refetch : null,
      goalsLoading: data ? data.loading : false,
      goalsError: data ? data.error : null,
      goals: data ? (data as any).goalSuggestionTemplates : null,
    }),
  }),
)(BuilderGoals);
