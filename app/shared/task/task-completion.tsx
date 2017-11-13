import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as completeMutationGraphql from '../../graphql/queries/task-complete-mutation.graphql';
import * as uncompleteMutationGraphql from '../../graphql/queries/task-uncomplete-mutation.graphql';
import {
  taskCompleteMutation,
  taskCompleteMutationVariables,
  taskUncompleteMutation,
  taskUncompleteMutationVariables,
} from '../../graphql/types';
import * as styles from './css/task-completion.css';

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
  constructor(props: IProps) {
    super(props);

    this.state = {
      toggleCompletionError: '',
    };

    this.toggleCompletion = this.toggleCompletion.bind(this);
  }

  async toggleCompletion() {
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
  }

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
  graphql<IGraphqlProps, IOwnProps>(completeMutationGraphql as any, { name: 'completeTask' }),
  graphql<IGraphqlProps, IOwnProps>(uncompleteMutationGraphql as any, { name: 'uncompleteTask' }),
)(TaskCompletion);
