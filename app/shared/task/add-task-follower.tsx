import { ApolloError } from 'apollo-client';
import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as careTeamQuery from '../../graphql/queries/get-patient-care-team.graphql';
import * as taskUserFollowMutationGraphql from '../../graphql/queries/task-user-follow-mutation.graphql';
import {
  taskUserFollowMutation,
  taskUserFollowMutationVariables,
  FullUserFragment,
  ShortUserFragment,
} from '../../graphql/types';
import Avatar from '../../shared/library/avatar/avatar';
import * as styles from './css/add-task-follower.css';

interface IProps {
  patientId: string;
  taskId: string;
  followers: ShortUserFragment[];
}

interface IGraphqlProps {
  loading?: boolean;
  error?: ApolloError | null | undefined;
  careTeam?: FullUserFragment[];
  addTaskFollower: (
    options: { variables: taskUserFollowMutationVariables },
  ) => { data: taskUserFollowMutation };
  mutate?: any;
}

interface IState {
  open: boolean;
  loading: boolean;
  lastCareTeamMemberId: string | null;
  addFollowerError: string | null;
}

type allProps = IProps & IGraphqlProps;

export class AddTaskFollower extends React.Component<allProps, IState> {
  state = {
    open: false,
    loading: false,
    addFollowerError: null,
    lastCareTeamMemberId: null,
  };

  renderCareTeamMember = (careTeamMember: FullUserFragment) => {
    const { addFollowerError, lastCareTeamMemberId } = this.state;

    const fullName = `${careTeamMember.firstName} ${careTeamMember.lastName}`;
    const role = careTeamMember.userRole;
    const errorStyles = classNames(styles.addError, {
      [styles.visible]: !!addFollowerError && lastCareTeamMemberId === careTeamMember.id,
    });

    return (
      <div
        key={careTeamMember.id}
        onClick={async () => this.onCareTeamMemberClick(careTeamMember.id)}
        className={styles.careTeamMemberDetails}
      >
        <Avatar src={careTeamMember.googleProfileImageUrl} size="medium" />
        <div className={styles.careTeamMemberLabel}>
          <div className={styles.careTeamMemberName}>{fullName}</div>
          <div className={styles.careTeamMemberRole}>{role}</div>
        </div>
        <div className={errorStyles} />
      </div>
    );
  };

  getValidNewFollowers = () => {
    const { careTeam, followers } = this.props;

    return (careTeam || []).filter(
      careTeamMember => !(followers || []).some(follower => follower.id === careTeamMember.id),
    );
  };

  renderCareTeamMembers = (careTeamMembers: FullUserFragment[]) => {
    return careTeamMembers.map(this.renderCareTeamMember);
  };

  onCareTeamMemberClick = async (careTeamMemberId: string) => {
    const { taskId, addTaskFollower } = this.props;
    const { loading } = this.state;

    if (!loading) {
      this.setState({
        loading: true,
        addFollowerError: null,
        lastCareTeamMemberId: null,
      });

      try {
        await addTaskFollower({
          variables: {
            userId: careTeamMemberId,
            taskId,
          },
        });

        this.setState({
          open: false,
          loading: false,
          addFollowerError: null,
          lastCareTeamMemberId: null,
        });
      } catch (err) {
        this.setState({
          loading: false,
          addFollowerError: err.message,
          lastCareTeamMemberId: careTeamMemberId,
        });
      }
    }
  };

  onClick = () => {
    const { open } = this.state;
    this.setState({ open: !open });
  };

  render() {
    const { open } = this.state;

    const careTeamContainerStyles = classNames(styles.careTeam, {
      [styles.hidden]: !open,
    });

    const validNewFollowers = this.getValidNewFollowers();

    const addFollowerButtonStyles = classNames(styles.addFollower, {
      [styles.hidden]: !validNewFollowers.length,
    });

    return (
      <div className={styles.container}>
        <div className={careTeamContainerStyles}>
          {this.renderCareTeamMembers(validNewFollowers)}
        </div>
        <div className={addFollowerButtonStyles} onClick={this.onClick} />
      </div>
    );
  }
}

export default compose(
  graphql(taskUserFollowMutationGraphql as any, {
    name: 'addTaskFollower',
  }),
  graphql(careTeamQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      careTeam: data ? (data as any).patientCareTeam : null,
    }),
  }),
)(AddTaskFollower) as React.ComponentClass<IProps>;
