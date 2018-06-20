import classNames from 'classnames';
import { History } from 'history';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import goals from '../graphql/queries/get-goal-suggestion-templates.graphql';
import goalDelete from '../graphql/queries/goal-suggestion-template-delete-mutation.graphql';
import {
  getGoalSuggestionTemplates,
  goalSuggestionTemplateDelete,
  goalSuggestionTemplateDeleteVariables,
  FullGoalSuggestionTemplate,
} from '../graphql/types';
import styles from '../shared/css/two-panel.css';
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
  goals?: getGoalSuggestionTemplates['goalSuggestionTemplates'];
  loading: boolean;
  error: string | null;
  deleteGoal?: (
    options: { variables: goalSuggestionTemplateDeleteVariables },
  ) => { data: goalSuggestionTemplateDelete };
}

type allProps = IProps & IGraphqlProps & IStateProps;

interface IState {
  showCreateGoal: boolean;
  loading: boolean;
  error: string | null;
}

export class BuilderGoals extends React.Component<allProps, IState> {
  state = {
    showCreateGoal: false,
    loading: false,
    error: null,
  };

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

  hideCreateGoal = (goal?: FullGoalSuggestionTemplate) => {
    this.setState({ showCreateGoal: false });
  };

  renderGoals = (goalsList: getGoalSuggestionTemplates['goalSuggestionTemplates']) => {
    const { loading, error } = this.props;
    const validGoals = (goalsList || []).filter(
      goal => goal && !goal.deletedAt,
    ) as FullGoalSuggestionTemplate[];

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

  renderGoal = (goal: FullGoalSuggestionTemplate) => {
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
    const { routeBase, goalId } = this.props;
    const { showCreateGoal } = this.state;
    const goalsList = this.props.goals || [];
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
  graphql(goalDelete, { name: 'deleteGoal' }),
  graphql(goals, {
    props: ({ data }) => ({
      refetchGoals: data ? data.refetch : null,
      goalsLoading: data ? data.loading : false,
      goalsError: data ? data.error : null,
      goals: data ? (data as any).goalSuggestionTemplates : null,
    }),
  }),
)(BuilderGoals) as React.ComponentClass<IProps>;
