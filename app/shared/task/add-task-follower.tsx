import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as careTeamQuery from '../../graphql/queries/get-patient-care-team.graphql';
/* tslint:disable:max-line-length */
import * as taskUserFollowMutationGraphql from '../../graphql/queries/task-user-follow-mutation.graphql';
/* tslint:enable:max-line-length */
import {
  taskUserFollowMutation,
  taskUserFollowMutationVariables,
  FullUserFragment,
  ShortUserFragment,
} from '../../graphql/types';
import * as styles from './css/add-task-follower.css';
import { DEFAULT_AVATAR_URL } from './task';

interface IProps {
  patientId: string;
  taskId: string;
  followers: ShortUserFragment[];
}

interface IGraphqlProps {
  loading?: boolean;
  error?: string;
  careTeam?: FullUserFragment[];
  addTaskFollower: (
    options: { variables: taskUserFollowMutationVariables },
  ) => { data: taskUserFollowMutation };
  mutate?: any;
}

interface IState {
  open: boolean;
  loading: boolean;
  lastCareTeamMemberId?: string;
  addFollowerError?: string;
}

type allProps = IProps & IGraphqlProps;

export class AddTaskFollower extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onCareTeamMemberClick = this.onCareTeamMemberClick.bind(this);
    this.renderCareTeamMember = this.renderCareTeamMember.bind(this);
    this.renderCareTeamMembers = this.renderCareTeamMembers.bind(this);
    this.getValidNewFollowers = this.getValidNewFollowers.bind(this);

    this.state = {
      open: false,
      loading: false,
      addFollowerError: undefined,
      lastCareTeamMemberId: undefined,
    };
  }

  renderCareTeamMember(careTeamMember: FullUserFragment) {
    const { addFollowerError, lastCareTeamMemberId } = this.state;

    const avatar = careTeamMember.googleProfileImageUrl || DEFAULT_AVATAR_URL;
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
        <div
          className={styles.careTeamAvatar}
          style={{
            backgroundImage: `url('${avatar}')`,
          }}
        />
        <div className={styles.careTeamMemberLabel}>
          <div className={styles.careTeamMemberName}>{fullName}</div>
          <div className={styles.careTeamMemberRole}>{role}</div>
        </div>
        <div className={errorStyles} />
      </div>
    );
  }

  getValidNewFollowers() {
    const { careTeam, followers } = this.props;

    return (careTeam || []).filter(
      careTeamMember => !(followers || []).some(follower => follower.id === careTeamMember.id),
    );
  }

  renderCareTeamMembers(careTeamMembers: FullUserFragment[]) {
    return careTeamMembers.map(this.renderCareTeamMember);
  }

  async onCareTeamMemberClick(careTeamMemberId: string) {
    const { taskId, addTaskFollower } = this.props;
    const { loading } = this.state;

    if (!loading) {
      this.setState(() => ({
        loading: true,
        addFollowerError: undefined,
        lastCareTeamMemberId: undefined,
      }));

      try {
        await addTaskFollower({
          variables: {
            userId: careTeamMemberId,
            taskId,
          },
        });

        this.setState(() => ({
          open: false,
          loading: false,
          addFollowerError: undefined,
          lastCareTeamMemberId: undefined,
        }));
      } catch (err) {
        this.setState(() => ({
          loading: false,
          addFollowerError: err.message,
          lastCareTeamMemberId: careTeamMemberId,
        }));
      }
    }
  }

  onClick() {
    this.setState((prevState: IState) => ({ open: !prevState.open }));
  }

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
  graphql<IGraphqlProps, IProps>(taskUserFollowMutationGraphql as any, { name: 'addTaskFollower' }),
  graphql<IGraphqlProps, IProps>(careTeamQuery as any, {
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
)(AddTaskFollower);
