import * as React from 'react';
import { ShortUserFragment } from '../../graphql/types';
import AddTaskFollower from './add-task-follower';
import * as styles from './css/followers.css';

export const DEFAULT_AVATAR_URL = 'https://bit.ly/2weRwJm';

export interface IProps {
  patientId: string;
  taskId: string;
  followers: ShortUserFragment[];
}

interface IFollowerProps {
  follower: ShortUserFragment;
}

export const Follower: React.StatelessComponent<IFollowerProps> = ({ follower }) => {
  const backgroundImage = `url('${follower.googleProfileImageUrl || DEFAULT_AVATAR_URL}')`;

  return <div className={styles.avatar} style={{ backgroundImage }} />;
};

const TaskFollowers: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patientId, taskId, followers } = props;

  const renderedFollowers = followers.map(follower => (
    <Follower key={follower.id} follower={follower} />
  ));

  return (
    <div className={styles.container}>
      {renderedFollowers}
      <AddTaskFollower patientId={patientId} taskId={taskId} followers={followers} />
    </div>
  );
};

export default TaskFollowers;
