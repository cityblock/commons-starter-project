import * as React from 'react';
import { taskEditMutation, taskEditMutationVariables } from '../../graphql/types';
import * as styles from './css/task-progress.css';
import TaskCompletion from './task-completion';
import TaskDue from './task-due';

interface IProps {
  dueAt: string;
  taskId: string;
  completedAt: string;
  editTask: (options: { variables: taskEditMutationVariables }) => { data: taskEditMutation };
}

const TaskProgress: React.StatelessComponent<IProps> = (props: IProps) => {
  const { dueAt, taskId, completedAt, editTask } = props;

  return (
    <div className={styles.container}>
      <TaskDue taskId={taskId} dueAt={dueAt} completedAt={completedAt} editTask={editTask} />
      <TaskCompletion taskId={taskId} completedAt={completedAt} />
    </div>
  );
};

export default TaskProgress;