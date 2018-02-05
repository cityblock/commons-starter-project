import * as classNames from 'classnames';
import * as React from 'react';
import { taskEditMutation, taskEditMutationVariables } from '../../graphql/types';
import { isDueSoon, isPastDue } from '../helpers/format-helpers';
import DateInput from '../library/date-input/date-input';
import Icon from '../library/icon/icon';
import * as styles from './css/task-due.css';

export interface IProps {
  dueAt: string;
  taskId: string;
  completedAt: string;
  editTask: (options: { variables: taskEditMutationVariables }) => { data: taskEditMutation };
}

class TaskDue extends React.Component<IProps> {
  onDueDateChange = async (dueAt: string | null) => {
    const { taskId, editTask } = this.props;

    if (taskId) {
      await editTask({ variables: { taskId, dueAt } });
    }
  };

  render(): JSX.Element {
    const { dueAt, completedAt } = this.props;
    const dueSoon = isDueSoon(dueAt);
    const pastDue = isPastDue(dueAt);

    const iconStyles = classNames(styles.icon, {
      [styles.dueSoonIcon]: dueSoon,
      [styles.pastDueIcon]: pastDue,
      [styles.completeIcon]: !!completedAt,
    });

    return (
      <div className={styles.dueDate}>
        <Icon name="event" className={iconStyles} />
        <DateInput value={completedAt || dueAt} onChange={this.onDueDateChange} small={true} />
      </div>
    );
  }
}

export default TaskDue;
