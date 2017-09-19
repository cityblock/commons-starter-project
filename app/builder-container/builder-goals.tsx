import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { push } from 'react-router-redux';
/* tslint:disable:max-line-length */
import * as goalDeleteMutation from '../graphql/queries/goal-suggestion-template-delete-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  goalSuggestionTemplateDeleteMutationVariables,
  FullGoalSuggestionTemplateFragment,
} from '../graphql/types';
import * as styles from './css/two-panel-builder.css';
import Goal from './goal';
import GoalCreate from './goal-create';
import { GoalRow } from './goal-row';

export interface IProps {
  loading?: boolean;
  error?: string;
  deleteGoal?: (
    options: { variables: goalSuggestionTemplateDeleteMutationVariables },
  ) => { data: { goalDelete: FullGoalSuggestionTemplateFragment } };
  mutate?: any;
  redirectToGoals?: () => any;
  routeBase: string;
  goalId?: string;
  goals?: FullGoalSuggestionTemplateFragment[];
  refetchGoals: () => any;
}

export interface IState {
  showCreateGoal: false;
}

export class BuilderGoals extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.renderGoals = this.renderGoals.bind(this);
    this.renderGoal = this.renderGoal.bind(this);
    this.showCreateGoal = this.showCreateGoal.bind(this);
    this.hideCreateGoal = this.hideCreateGoal.bind(this);
    this.onDeleteGoal = this.onDeleteGoal.bind(this);

    this.state = {
      showCreateGoal: false,
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { loading, error, goalId } = nextProps;
    this.setState(() => ({ loading, error }));
    if (goalId && goalId !== this.props.goalId) {
      this.props.refetchGoals();
    }
  }

  showCreateGoal() {
    this.setState(() => ({ showCreateGoal: true }));
  }

  hideCreateGoal(goal?: FullGoalSuggestionTemplateFragment) {
    this.setState(() => ({ showCreateGoal: false }));
  }

  renderGoals(goals: FullGoalSuggestionTemplateFragment[]) {
    const { loading, error } = this.props;
    const validGoals = goals.filter(goal => !goal.deletedAt);

    if (validGoals.length > 0) {
      return validGoals.map(this.renderGoal);
    } else if (!loading && !error) {
      return (
        <div className={styles.emptyMessage}>
          <div className={styles.emptyLogo}></div>
          <div className={styles.emptyLabel}>No Goals</div>
        </div>
      );
    }
  }

  renderGoal(goal: FullGoalSuggestionTemplateFragment) {
    const selected = goal.id === this.props.goalId;
    return (
      <GoalRow
        key={goal.id}
        goal={goal}
        selected={selected}
        routeBase={this.props.routeBase}
      />
    );
  }

  async onDeleteGoal(goalId: string) {
    const { redirectToGoals, deleteGoal } = this.props;

    if (deleteGoal) {
      await deleteGoal({ variables: { goalSuggestionTemplateId: goalId } });
    }

    if (redirectToGoals) {
      redirectToGoals();
    }
  }

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
        <div
          onClick={this.showCreateGoal}
          className={styles.createButton}>Create Goal</div>
      </div>
    );
    const createGoalHtml = showCreateGoal ? (
      <GoalCreate
        goalId={goalId}
        onClose={this.hideCreateGoal}
        routeBase={this.props.routeBase} />
    ) : null;
    const renderedGoal = (props: any) => (
      <Goal
        goals={goals}
        routeBase={routeBase}
        onDelete={this.onDeleteGoal}
        {...props } />
    );
    const goalHtml = showCreateGoal ?
      null : (<Route path={`${routeBase}/:objectId`} render={renderedGoal} />);
    return (
      <div className={styles.container}>
        <div className={styles.sortSearchBar}>
          {createGoalButton}
        </div>
        <div className={styles.bottomContainer}>
          <div className={goalListStyles}>
            {this.renderGoals(goalsList)}
          </div>
          <div className={goalContainerStyles}>
            {goalHtml}
            {createGoalHtml}
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: IProps): Partial<IProps> {
  return {
    redirectToGoals: () => {
      const { routeBase } = ownProps;
      dispatch(push(routeBase));
    },
  };
}

export default (compose)(
  connect<any, any, IProps>(null, mapDispatchToProps),
  graphql(goalDeleteMutation as any, { name: 'deleteGoal' }),
)(BuilderGoals);
