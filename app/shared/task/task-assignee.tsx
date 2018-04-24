import { ApolloError } from 'apollo-client';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as careTeamQuery from '../../graphql/queries/get-patient-care-team.graphql';
import { FullUserFragment, ShortUserFragment } from '../../graphql/types';
import { getAssigneeInfo } from '../helpers/assignee-helpers';
import SelectDropdownOption from '../library/select-dropdown-option/select-dropdown-option';
import SelectDropdown from '../library/select-dropdown/select-dropdown';
import * as styles from './css/task-body.css';

export interface IProps {
  patientId: string;
  onAssigneeClick: (assignedToId: string, assignedToEmail: string | null) => void;
  assignee?: ShortUserFragment | null;
  selectedAssigneeId?: string;
  messageId?: string;
  messageStyles?: string;
  dropdownStyles?: string;
  menuStyles?: string;
  largeFont?: boolean;
}

interface IGraphqlProps {
  loading: boolean;
  error: ApolloError | null | undefined;
  careTeam: FullUserFragment[];
}

interface IState {
  loading: boolean;
  changeAssigneeError: string;
}

export type allProps = IProps & IGraphqlProps;

export class TaskAssignee extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = {
      loading: false,
      changeAssigneeError: '',
    };
  }

  onNewAssigneeClick = async (careTeamMemberId: string, careTeamMemberEmail: string | null) => {
    const { onAssigneeClick } = this.props;

    if (!this.state.loading) {
      this.setState({ loading: true, changeAssigneeError: '' });

      try {
        await onAssigneeClick(careTeamMemberId, careTeamMemberEmail);
        this.setState(() => ({ loading: false }));
      } catch (err) {
        this.setState({ loading: false, changeAssigneeError: err.message });
      }
    }
  };

  getValidAssignees(): FullUserFragment[] {
    const { careTeam, assignee } = this.props;

    return (careTeam || []).filter(member => (assignee ? member.id !== assignee.id : member));
  }

  renderCareTeamOptions(): JSX.Element[] {
    const assigneeOptions = this.getValidAssignees();

    return assigneeOptions.map(assigneeOption => {
      const { avatar, name, role } = getAssigneeInfo(assigneeOption);

      return (
        <SelectDropdownOption
          key={assigneeOption.id}
          onClick={async () => this.onNewAssigneeClick(assigneeOption.id, assigneeOption.email)}
          avatarUrl={avatar}
          value={name}
          detail={role}
        />
      );
    });
  }

  render(): JSX.Element {
    const {
      messageId,
      messageStyles,
      selectedAssigneeId,
      careTeam,
      dropdownStyles,
      menuStyles,
      largeFont,
    } = this.props;
    const assignee =
      this.props.assignee ||
      (selectedAssigneeId && careTeam.find(a => a.id === selectedAssigneeId)) ||
      null;

    const assigneeInfo = getAssigneeInfo(assignee);

    return (
      <div>
        <FormattedMessage id={messageId || 'task.assign'}>
          {(message: string) => <h3 className={messageStyles || styles.label}>{message}</h3>}
        </FormattedMessage>
        <SelectDropdown
          value={assigneeInfo.name}
          detail={assigneeInfo.role}
          avatarUrl={assigneeInfo.avatar}
          loading={this.props.loading}
          error={this.state.changeAssigneeError}
          className={dropdownStyles}
          menuStyles={menuStyles}
          largeFont={!!largeFont}
        >
          {this.renderCareTeamOptions()}
        </SelectDropdown>
      </div>
    );
  }
}

export default graphql(careTeamQuery as any, {
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
})(TaskAssignee);
