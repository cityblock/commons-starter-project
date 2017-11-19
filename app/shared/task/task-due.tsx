import * as classNames from 'classnames';
import * as React from 'react';
import { taskEditMutation, taskEditMutationVariables } from '../../graphql/types';
import { formatDueDate, isDueSoon, isPastDue } from '../helpers/format-helpers';
import DateInput from '../library/date-input/date-input';
import * as styles from './css/task-due.css';

export interface IProps {
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
  };

  render(): JSX.Element {
    const { dueAt, completedAt } = this.props;
    const dueSoon = isDueSoon(dueAt);
    const pastDue = isPastDue(dueAt);
    const dueDate = completedAt ? formatDueDate(completedAt, true) : formatDueDate(dueAt, false);
    const { changeDueDateError } = this.state;

    const iconStyles = classNames(styles.dueDateIcon, {
      [styles.dueSoonIcon]: dueSoon,
      [styles.pastDueIcon]: pastDue,
      [styles.completeIcon]: !!completedAt,
    });

    return (
      <div className={styles.dueDate}>
        <div className={iconStyles} />
        <DateInput
          value={completedAt || dueAt}
          onChange={this.onDueDateChange}
          displayText={changeDueDateError || dueDate}
        />
      </div>
    );
  }
}

export default TaskDue;
