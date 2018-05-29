import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { openPopup } from '../../actions/popup-action';
import { ShortUserFragment } from '../../graphql/types';
import Avatar from '../library/avatar/avatar';
import * as styles from './css/followers.css';

interface IProps {
  follower: ShortUserFragment;
  taskId: string;
}

interface IDispatchProps {
  openUnfollowPopup: (taskId: string, userId: string) => void;
}

type allProps = IProps & IDispatchProps;

const Follower: React.StatelessComponent<allProps> = (props: allProps) => {
  const { follower, taskId, openUnfollowPopup } = props;
  return (
    <div className={styles.follower} onClick={() => openUnfollowPopup(taskId, follower.id)}>
      <Avatar src={follower.googleProfileImageUrl} size="medium" />{' '}
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: IProps): IDispatchProps => ({
  openUnfollowPopup: (taskId: string, userId: string) =>
    dispatch(
      openPopup({
        name: 'TASK_UNFOLLOW',
        options: {
          userId,
          taskId,
        },
      }),
    ),
});

export default connect<{}, IDispatchProps, IProps>(
  null,
  mapDispatchToProps,
)(Follower) as any;
