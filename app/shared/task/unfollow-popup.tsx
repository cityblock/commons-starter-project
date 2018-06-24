import { History } from 'history';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { withRouter } from 'react-router';
import { closePopup } from '../../actions/popup-action';
import taskUserUnfollowGraphql from '../../graphql/queries/task-user-unfollow-mutation.graphql';
import { taskUserUnfollow, taskUserUnfollowVariables } from '../../graphql/types';
import { ITaskUnfollowPopupOptions } from '../../reducers/popup-reducer';
import { IState as IAppState } from '../../store';
import Modal from '../library/modal/modal';

interface IProps {
  history: History;
}

interface IStateProps {
  isVisible: boolean;
  taskId: string | null;
  userId: string | null;
}

interface IDispatchProps {
  onDismiss: () => void;
}

interface IGraphqlProps {
  removeTaskFollower: (
    options: { variables: taskUserUnfollowVariables },
  ) => { data: taskUserUnfollow };
}

type allProps = IProps & IGraphqlProps & IStateProps & IDispatchProps;

class UnfollowPopup extends React.Component<allProps> {
  handleRemoveFollower = () => {
    const { removeTaskFollower, onDismiss, taskId, userId } = this.props;

    if (taskId && userId) {
      removeTaskFollower({ variables: { taskId, userId } });
    }
    onDismiss();
  };

  render() {
    const { onDismiss, isVisible } = this.props;

    return (
      <Modal
        isVisible={isVisible}
        titleMessageId="unfollowPopup.title"
        subTitleMessageId="unfollowPopup.subtitle"
        headerIconName="errorOutline"
        headerIconColor="red"
        headerIconSize="large"
        onClose={onDismiss}
        onSubmit={this.handleRemoveFollower}
        cancelMessageId="unfollowPopup.cancel"
        submitMessageId="unfollowPopup.remove"
      />
    );
  }
}

const mapStateToProps = (state: IAppState): IStateProps => {
  const isVisible = state.popup.name === 'TASK_UNFOLLOW';
  const userId = isVisible ? (state.popup.options as ITaskUnfollowPopupOptions).userId : null;
  const taskId = isVisible ? (state.popup.options as ITaskUnfollowPopupOptions).taskId : null;

  return { isVisible, userId, taskId };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): IDispatchProps => {
  const onDismiss = () => dispatch(closePopup());
  return { onDismiss };
};

export default compose(
  withRouter,
  connect<IStateProps, IDispatchProps, {}>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps as any,
  ),
  graphql(taskUserUnfollowGraphql, {
    name: 'removeTaskFollower',
  }),
)(UnfollowPopup) as React.ComponentClass<{}>;
