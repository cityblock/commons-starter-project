import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as careTeamQuery from '../../graphql/queries/get-patient-care-team.graphql';
import {
  taskEditMutation,
  taskEditMutationVariables,
  FullUserFragment,
  ShortUserFragment,
} from '../../graphql/types';
import { getAssigneeInfo } from '../helpers/assignee-helpers';
import SelectDropdownOption from '../library/select-dropdown-option/select-dropdown-option';
import SelectDropdown from '../library/select-dropdown/select-dropdown';
import * as styles from './css/task-body.css';

export interface IProps {
  patientId: string;
  taskId: string;
  editTask: (options: { variables: taskEditMutationVariables }) => { data: taskEditMutation };
  assignee?: ShortUserFragment;
}

interface IGraphqlProps {
  loading: boolean;
  error: string;
  careTeam: FullUserFragment[];
}

interface IState {
  loading: boolean;
  changeAssigneeError: string;
}

type allProps = IProps & IGraphqlProps;

export class TaskAssignee extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = {
      loading: false,
      changeAssigneeError: '',
    };
  }

  onNewAssigneeClick = async (careTeamMemberId: string) => {
    const { taskId, editTask } = this.props;

    if (!this.state.loading) {
      this.setState(() => ({ loading: true, changeAssigneeError: '' }));

      try {
        await editTask({ variables: { assignedToId: careTeamMemberId, taskId }});
        this.setState(() => ({ loading: false }));
      } catch (err) {
        this.setState(() => ({ loading: false, changeAssigneeError: err.message }));
      }
    }
  }

  getValidAssignees(): FullUserFragment[] {
    const { careTeam, assignee } = this.props;
    return (careTeam || []).filter(member => assignee && member.id !== assignee.id);
  }

  renderCareTeamOptions(): JSX.Element[] {
    const assigneeOptions = this.getValidAssignees();

    return assigneeOptions.map(assigneeOption => {
      const { avatar, name, role } = getAssigneeInfo(assigneeOption);

      return (
        <SelectDropdownOption
          key={assigneeOption.id}
          onClick={async () => this.onNewAssigneeClick(assigneeOption.id)}
          avatarUrl={avatar}
          value={name}
          detail={role} />
      );
    });
  }

  render(): JSX.Element {
    const assigneeInfo = getAssigneeInfo(this.props.assignee);

    return (
      <div>
        <FormattedMessage id='task.assign'>{
          (message: string) => <h3 className={styles.label}>{message}</h3>
        }</FormattedMessage>
        <SelectDropdown
          value={assigneeInfo.name}
          detail={assigneeInfo.role}
          avatarUrl={assigneeInfo.avatar}
          loading={this.props.loading}
          error={this.state.changeAssigneeError}>
          {this.renderCareTeamOptions()}
        </SelectDropdown>
      </div>
    );
  }
}

export default compose(
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
)(TaskAssignee);
