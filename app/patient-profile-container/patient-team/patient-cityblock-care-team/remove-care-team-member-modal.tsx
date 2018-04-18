import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as careTeamReassignUserMutationGraphql from '../../../graphql/queries/care-team-reassign-user-mutation.graphql';
import * as tasksForUserForPatientQuery from '../../../graphql/queries/get-tasks-for-user-for-patient.graphql';
import {
  careTeamReassignUserMutation,
  careTeamReassignUserMutationVariables,
  getPatientCareTeamQuery,
  getTasksForUserForPatientQuery,
  FullUserFragment,
} from '../../../graphql/types';
import { formatErrorMessage } from '../../../shared/helpers/format-helpers';
import Modal from '../../../shared/library/modal/modal';
import * as styles from './css/remove-care-team-member-modal.css';
import RemoveCareTeamMember from './remove-care-team-member';

interface IProps {
  closePopup: () => void;
  isVisible: boolean;
  patientId: string;
  careTeamMember?: FullUserFragment | null;
  careTeam?: getPatientCareTeamQuery['patientCareTeam'];
}

interface IGraphqlProps {
  careTeamMemberTasks: getTasksForUserForPatientQuery['tasksForUserForPatient'];
  isTasksLoading?: boolean;
  tasksError?: string | null;
  careTeamReassignUser: (
    options: { variables: careTeamReassignUserMutationVariables },
  ) => { data: careTeamReassignUserMutation };
}

type allProps = IProps & IGraphqlProps;

interface IState {
  reassignedToId?: string | null;
  reassignUserLoading?: boolean;
  reassignUserError?: string | null;
}

export class RemoveCareTeamMemberModal extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = { reassignedToId: null };
  }

  getModalTitleBodyMessageId() {
    const { careTeamMemberTasks } = this.props;

    if (careTeamMemberTasks && careTeamMemberTasks.length) {
      return 'patientTeam.removeCityblockTeamModalHeaderBodyWithTasks';
    } else {
      return 'patientTeam.removeCityblockTeamModalHeaderBody';
    }
  }

  getModalSubmitButtonMessageId() {
    const { careTeamMemberTasks } = this.props;

    if (careTeamMemberTasks && careTeamMemberTasks.length) {
      return 'patientTeam.removeCityblockTeamModalSubmitButtonWithTasks';
    } else {
      return 'patientTeam.removeCityblockTeamModalSubmitButton';
    }
  }

  onRemoveCareTeamMember = async () => {
    const {
      closePopup,
      careTeamMemberTasks,
      isTasksLoading,
      careTeamReassignUser,
      patientId,
      careTeamMember,
    } = this.props;
    const { reassignedToId, reassignUserLoading } = this.state;

    // Don't do anything if we're loading
    if (isTasksLoading || !careTeamMemberTasks || reassignUserLoading || !careTeamMember) {
      return null;
    }

    // If there are tasks, a reassignedToId *must* be set before submitting
    if (careTeamMemberTasks.length > 0 && !reassignedToId) {
      return null;
    }

    try {
      this.setState({
        reassignUserLoading: true,
        reassignUserError: null,
      });

      await careTeamReassignUser({
        variables: {
          patientId,
          userId: careTeamMember.id,
          reassignedToId,
        },
      });

      this.setState({ reassignUserLoading: false, reassignedToId: null });
      closePopup();
    } catch (err) {
      this.setState({ reassignUserLoading: false, reassignUserError: formatErrorMessage(err) });
    }
  };

  onChangeReassignedTo = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ [e.currentTarget.name as any]: e.currentTarget.value });
  };

  onClose = () => {
    const { closePopup } = this.props;

    this.setState({ reassignedToId: null, reassignUserError: null, reassignUserLoading: false });

    closePopup();
  };

  render() {
    const { isVisible, isTasksLoading, careTeamMemberTasks, careTeam, careTeamMember } = this.props;
    const { reassignedToId, reassignUserError, reassignUserLoading } = this.state;

    const modalTitleBodyMessageId = isTasksLoading
      ? 'patientTeam.removeCityblockTeamModalHeaderBody'
      : this.getModalTitleBodyMessageId();
    const modalSubmitMessageId = isTasksLoading
      ? 'patientTeam.removeCityblockTeamModalSubmitButton'
      : this.getModalSubmitButtonMessageId();

    return (
      <Modal
        className={styles.removeCareTeamMemberModal}
        headerClassName={styles.header}
        isVisible={isVisible}
        headerColor="white"
        onClose={this.onClose}
        redSubmitButton={true}
        onSubmit={this.onRemoveCareTeamMember}
        titleMessageId="patientTeam.removeCityblockTeamModalHeader"
        subTitleMessageId={modalTitleBodyMessageId}
        submitMessageId={modalSubmitMessageId}
        headerIconName="errorOutline"
        headerIconColor="red"
        headerIconSize="extraLarge"
        error={reassignUserError}
        isLoading={reassignUserLoading}
      >
        <RemoveCareTeamMember
          onChange={this.onChangeReassignedTo}
          isLoading={isTasksLoading}
          tasksCount={careTeamMemberTasks ? careTeamMemberTasks.length : 0}
          careTeamMember={careTeamMember}
          reassignedToId={reassignedToId}
          careTeam={careTeam}
        />
      </Modal>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(tasksForUserForPatientQuery as any, {
    skip: (props: IProps) => !props.careTeamMember,
    options: (props: IProps) => ({
      variables: {
        userId: props.careTeamMember!.id,
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      isTasksLoading: data ? data.loading : false,
      tasksError: data ? data.error : null,
      careTeamMemberTasks: data ? (data as any).tasksForUserForPatient : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(careTeamReassignUserMutationGraphql as any, {
    name: 'careTeamReassignUser',
    options: {
      refetchQueries: ['getPatientCareTeam', 'getUserSummaryList', 'getPatient'],
    },
  }),
)(RemoveCareTeamMemberModal);
