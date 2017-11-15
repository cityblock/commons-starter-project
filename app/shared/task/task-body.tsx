import * as React from 'react';
import { taskEditMutation, taskEditMutationVariables } from '../../graphql/types';
import * as styles from './css/task-body.css';
import { Divider } from './task';
import TaskInfo from './task-info';

interface IProps {
  taskId: string;
  title: string;
  description: string;
  goal: string;
  editTask: (options: { variables: taskEditMutationVariables }) => { data: taskEditMutation };
}

const TaskBody: React.StatelessComponent<IProps> = (props: IProps) => {
  const { title, description, taskId, goal, editTask } = props;

  return (
    <div>
      <TaskInfo taskId={taskId} title={title} description={description} editTask={editTask} />
      <Divider />
      <div className={styles.associations}>
        <div className={styles.detail}>
          <h3>Concern:</h3>
          <h3 className={styles.black}>Placeholder</h3>
        </div>
        <div className={styles.detail}>
          <h3>Goal:</h3>
          <h3 className={styles.black}>{goal}</h3>
        </div>
      </div>
    </div>
  );
};

export default TaskBody;
