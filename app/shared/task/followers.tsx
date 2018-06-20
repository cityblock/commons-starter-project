import React from 'react';
import { ShortUser } from '../../graphql/types';
import AddTaskFollower from './add-task-follower';
import styles from './css/followers.css';
import Follower from './follower';

export interface IProps {
  patientId: string;
  taskId: string;
  followers: ShortUser[];
}

const TaskFollowers: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patientId, taskId, followers } = props;

  const renderedFollowers = followers.map(follower => (
    <Follower key={follower.id} follower={follower} taskId={taskId} />
  ));

  return (
    <div className={styles.container}>
      {renderedFollowers}
      <AddTaskFollower patientId={patientId} taskId={taskId} followers={followers} />
    </div>
  );
};

export default TaskFollowers;
