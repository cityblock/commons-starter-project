import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Priority } from '../../../server/models/task';
import { taskEditMutation, taskEditMutationVariables } from '../../graphql/types';
import { ShortUserFragment } from '../../graphql/types';
import * as styles from './css/task-body.css';
import TaskFollowers from './followers';
import PrioritySelect from './priority-select';

interface IProps {
  taskId: string;
  patientId: string;
  priority: Priority;
  followers: ShortUserFragment[];
  editTask: (options: { variables: taskEditMutationVariables }) => { data: taskEditMutation };
}

const TaskTracking: React.StatelessComponent<IProps> = (props: IProps) => {
  const { taskId, patientId, priority, followers, editTask } = props;

  return (
    <div className={styles.container}>
      <div className={styles.detail}>
        <FormattedMessage id="task.priority">
          {(message: string) => (
            <h3>{message}</h3>
          )}
        </FormattedMessage>
        <PrioritySelect taskId={taskId} priority={priority} editTask={editTask} />
      </div>
      <div className={styles.detail}>
        <FormattedMessage id="task.followers">
          {(message: string) => (
            <h3>{message}</h3>
          )}
        </FormattedMessage>
        <TaskFollowers taskId={taskId} patientId={patientId} followers={followers} />
      </div>
    </div>
  );
};

export default TaskTracking;
