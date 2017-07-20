import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as styles from '../css/components/add-task-follower.css';
import * as taskStyles from '../css/components/task.css';
import * as careTeamQuery from '../graphql/queries/get-patient-care-team.graphql';
import * as editTaskMutation from '../graphql/queries/task-edit-mutation.graphql';
import {
  FullTaskFragment,
  FullUserFragment,
  TaskEditMutationVariables,
} from '../graphql/types';
import { DEFAULT_AVATAR_URL } from './task';

export interface IProps {
  patientId: string;
  taskId: string;
  assignee: FullUserFragment;
  loading?: boolean;
  error?: string;
  careTeam?: FullUserFragment[];
  changeAssignee: (
    options: { variables: TaskEditMutationVariables },
  ) => { data: { taskEdit: FullTaskFragment } };
}

export interface IState {
  open: boolean;
  loading: boolean;
  changeAssigneeError?: string;
}

export interface IAssigneeInfo {
  avatar: string;
  name: string;
  role: string;
}

// TODO: genericize this and AddTaskFollower component
export class TaskAssignee extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onCareTeamMemberClick = this.onCareTeamMemberClick.bind(this);
    this.renderCareTeamMember = this.renderCareTeamMember.bind(this);
    this.renderCareTeamMembers = this.renderCareTeamMembers.bind(this);
    this.getValidAssignees = this.getValidAssignees.bind(this);
    this.getAssigneeInfo = this.getAssigneeInfo.bind(this);

    this.state = { open: false, loading: false };
  }

  getAssigneeInfo(): IAssigneeInfo {
    const { assignee } = this.props;

    return {
      avatar: assignee.googleProfileImageUrl || DEFAULT_AVATAR_URL,
      name: `${assignee.firstName} ${assignee.lastName}`,
      role: assignee.userRole || 'Unknown Role',
    };
  }

  renderCareTeamMember(careTeamMember: FullUserFragment) {
    const avatar = careTeamMember.googleProfileImageUrl || DEFAULT_AVATAR_URL;
    const fullName = `${careTeamMember.firstName} ${careTeamMember.lastName}`;
    const role = careTeamMember.userRole;

    return (
      <div
        key={careTeamMember.id}
        onClick={async () => this.onCareTeamMemberClick(careTeamMember.id)}
        className={styles.careTeamMemberDetails}>
        <div
          className={styles.careTeamAvatar}
          style={{
            backgroundImage: `url('${avatar}')`,
          }}>
        </div>
        <div className={styles.careTeamMemberLabel}>
          <div className={styles.careTeamMemberName}>{fullName}</div>
          <div className={styles.careTeamMemberRole}>{role}</div>
        </div>
      </div>
    );
  }

  getValidAssignees() {
    const { careTeam, assignee } = this.props;

    return (careTeam || []).filter(careTeamMember => (
      careTeamMember.id !== assignee.id
    ));
  }

  renderCareTeamMembers(careTeamMembers: FullUserFragment[]) {
    return careTeamMembers.map(this.renderCareTeamMember);
  }

  async onCareTeamMemberClick(careTeamMemberId: string) {
    const { taskId, changeAssignee } = this.props;
    const { loading } = this.state;

    if (!loading) {
      this.setState(() => ({
        loading: true,
        changeAssigneeError: undefined,
      }));

      try {
        await changeAssignee({
          variables: {
            assignedToId: careTeamMemberId,
            taskId,
          },
        });

        this.setState(() => ({
          open: false,
          loading: false,
          changeAssigneeError: undefined,
        }));
      } catch (err) {
        this.setState(() => ({
          loading: false,
          changeAssigneeError: err.message,
        }));
      }
    }
  }

  onClick() {
    this.setState((prevState: IState) => ({ open: !prevState.open }));
  }

  render() {
    const { open, changeAssigneeError } = this.state;

    const careTeamContainerStyles = classNames(styles.careTeam, styles.assigneeCareTeam, {
      [styles.hidden]: !open,
    });
    const assigneeStyles = classNames(taskStyles.assignee, {
      [taskStyles.blueBorder]: open,
    });
    const changeAssigneeErrorStyles = classNames(taskStyles.changeAssigneeError, {
      [taskStyles.hidden]: !changeAssigneeError,
    });

    const validAssignees = this.getValidAssignees();
    const assigneeInfo = this.getAssigneeInfo();

    return (
      <div className={taskStyles.infoRowLeft}>
        <div className={assigneeStyles} onClick={this.onClick}>
          <div
            className={taskStyles.avatar}
            style={{ backgroundImage: `url('${assigneeInfo.avatar}')` }}>
          </div>
          <div className={taskStyles.name}>{assigneeInfo.name}</div>
          <div className={taskStyles.smallText}>{assigneeInfo.role}</div>
        </div>
        <div className={changeAssigneeErrorStyles}>
          <div className={classNames(taskStyles.smallText, taskStyles.redText)}>
            Error changing assignee.
          </div>
          <div className={taskStyles.smallText}>Please try again.</div>
        </div>
        <div className={careTeamContainerStyles}>
          {this.renderCareTeamMembers(validAssignees)}
        </div>
      </div>
    );
  }
}

export default (compose as any)(
  graphql(editTaskMutation as any, { name: 'changeAssignee' }),
  graphql(careTeamQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      loading: (data ? data.loading : false),
      error: (data ? data.error : null),
      careTeam: (data ? (data as any).patientCareTeam : null),
    }),
  }),
)(TaskAssignee);
