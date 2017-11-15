import * as classNames from 'classnames';
import * as React from 'react';
import { taskEditMutation, taskEditMutationVariables } from '../../graphql/types';
import { formatDueDate, formatInputDueDate, isDueSoon, isPastDue } from '../helpers/format-helpers';
import * as styles from './css/task-due.css';

interface IProps {
  dueAt: string;
  taskId: string;
  completedAt: string;
  editTask: (options: { variables: taskEditMutationVariables }) => { data: taskEditMutation };
}

interface IState {
  changeDueDateError: string;
}

class TaskDue extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      changeDueDateError: '',
    };
  }

  onDueDateChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { taskId, editTask } = this.props;

    if (taskId) {
      try {
        this.setState({ changeDueDateError: '' });
        await editTask({ variables: { taskId, dueAt: event.target.value } });
      } catch (err) {
        this.setState({ changeDueDateError: err.message });
      }
    }
  }

  render(): JSX.Element {
    const { dueAt, completedAt } = this.props;
    const dueSoon = isDueSoon(dueAt);
    const pastDue = isPastDue(dueAt);
    const dueDate = completedAt ? formatDueDate(completedAt, true) : formatDueDate(dueAt, false);
    const { changeDueDateError } = this.state;
    const value = completedAt ? formatInputDueDate(completedAt) : formatInputDueDate(dueAt);

    const iconStyles = classNames(styles.dueDateIcon, {
      [styles.dueSoonIcon]: dueSoon,
      [styles.pastDueIcon]: pastDue,
      [styles.completeIcon]: !!completedAt,
    });

    return (
      <div className={styles.dueDate}>
        <div className={iconStyles} />
        <input
          type="date"
          data-date={changeDueDateError || dueDate}
          value={value}
          onChange={this.onDueDateChange}
        />
      </div>
    );
  }
}

export default TaskDue;
