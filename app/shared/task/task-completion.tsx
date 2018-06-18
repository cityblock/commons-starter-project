import classNames from 'classnames';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import completeMutationGraphql from '../../graphql/queries/task-complete-mutation.graphql';
import uncompleteMutationGraphql from '../../graphql/queries/task-uncomplete-mutation.graphql';
import {
  taskCompleteMutation,
  taskCompleteMutationVariables,
  taskUncompleteMutation,
  taskUncompleteMutationVariables,
} from '../../graphql/types';
import styles from './css/task-completion.css';

interface IOwnProps {
  taskId: string;
  completedAt: string;
}

interface IGraphqlProps {
  completeTask: (
    options: { variables: taskCompleteMutationVariables },
  ) => { data: taskCompleteMutation };
  uncompleteTask: (
    options: { variables: taskUncompleteMutationVariables },
  ) => { data: taskUncompleteMutation };
}

type IProps = IOwnProps & IGraphqlProps;

interface IState {
  toggleCompletionError: string;
}

export class TaskCompletion extends React.Component<IProps, IState> {
  state = {
    toggleCompletionError: '',
  };

  toggleCompletion = async () => {
    const { taskId, completedAt, completeTask, uncompleteTask } = this.props;

    try {
      this.setState({ toggleCompletionError: '' });

      if (completedAt) {
        await uncompleteTask({ variables: { taskId } });
      } else {
        await completeTask({ variables: { taskId } });
      }
    } catch (err) {
      this.setState({ toggleCompletionError: err.message });
    }
  };

  render(): JSX.Element {
    const { completedAt } = this.props;
    const displayText = completedAt ? 'Task Complete' : 'Mark Complete';
    const buttonStyles = classNames(styles.button, {
      [styles.complete]: !!completedAt,
    });
    const iconStyles = classNames(styles.icon, {
      [styles.completeIcon]: !!completedAt,
    });

    return (
      <button className={buttonStyles} onClick={this.toggleCompletion}>
        <p>{displayText}</p>
        <div className={iconStyles} />
      </button>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IOwnProps>(completeMutationGraphql, { name: 'completeTask' }),
  graphql<IGraphqlProps, IOwnProps>(uncompleteMutationGraphql, { name: 'uncompleteTask' }),
)(TaskCompletion);
