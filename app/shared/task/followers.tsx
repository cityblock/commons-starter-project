import * as React from 'react';
import { ShortUserFragment } from '../../graphql/types';
import Avatar from '../library/avatar/avatar';
import AddTaskFollower from './add-task-follower';
import * as styles from './css/followers.css';

export interface IProps {
  patientId: string;
  taskId: string;
  followers: ShortUserFragment[];
}

interface IFollowerProps {
  follower: ShortUserFragment;
}

export const Follower: React.StatelessComponent<IFollowerProps> = ({ follower }) => {
  return (
    <div className={styles.follower}>
      <Avatar src={follower.googleProfileImageUrl} size="medium" />{' '}
    </div>
  );
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
