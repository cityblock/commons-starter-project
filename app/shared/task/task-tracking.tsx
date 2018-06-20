import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Priority } from '../../graphql/types';
import { ShortUser } from '../../graphql/types';
import styles from './css/task-body.css';
import TaskFollowers from './followers';
import PrioritySelect from './priority-select';

interface IProps {
  taskId: string;
  patientId: string;
  priority: Priority;
  followers: ShortUser[];
  onPriorityClick: (priority: Priority) => void;
}

const TaskTracking: React.StatelessComponent<IProps> = (props: IProps) => {
  const { taskId, patientId, priority, followers, onPriorityClick } = props;

  return (
    <div className={styles.container}>
      <div className={styles.detail}>
        <FormattedMessage id="task.priority">
          {(message: string) => <h3>{message}</h3>}
        </FormattedMessage>
        <PrioritySelect priority={priority} onPriorityClick={onPriorityClick} />
      </div>
      <div className={styles.detail}>
        <FormattedMessage id="task.followers">
          {(message: string) => <h3>{message}</h3>}
        </FormattedMessage>
        <TaskFollowers taskId={taskId} patientId={patientId} followers={followers} />
      </div>
    </div>
  );
};

export default TaskTracking;
