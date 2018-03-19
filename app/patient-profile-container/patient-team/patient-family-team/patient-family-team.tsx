import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as patientContactsQuery from '../../../graphql/queries/get-patient-contacts.graphql';
import * as patientContactDeleteMutationGraphql from '../../../graphql/queries/patient-contact-delete-mutation.graphql';
import {
  getPatientContactsQuery,
  patientContactDeleteMutation,
  patientContactDeleteMutationVariables,
  FullPatientContactFragment,
} from '../../../graphql/types';
import EditPatientContactModal from '../../../shared/patient-contact-modal/edit-patient-contact-modal';
import * as styles from '../css/patient-team.css';
import RequiredPlaceholder from '../required-placeholder';
import PatientFamilyMember from './patient-family-member';

interface IProps {
  patientId: string;
  onAddEmergencyContact: () => void;
}

interface IGraphqlProps {
  patientContacts?: getPatientContactsQuery['patientContacts'];
  patientContactDelete: (
    options: { variables: patientContactDeleteMutationVariables },
  ) => { data: patientContactDeleteMutation };
  isLoading?: boolean;
  error?: string | null;
}

export type allProps = IGraphqlProps & IProps;

interface IState {
  isEditModalVisible: boolean;
  patientContactToEdit?: FullPatientContactFragment | null;
}

export class PatientFamilyTeam extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = { isEditModalVisible: false };
  }

  handleRemove = async (patientContactId: string) => {
    const { patientContactDelete } = this.props;
    try {
      await patientContactDelete({ variables: { patientContactId } });
    } catch (err) {
      // TODO: handle errors
    }
  };

  handleEditSuccess = () => {
    // TODO: get rid of these
  };

  handleOpenEditModal = (patientContactToEdit: FullPatientContactFragment) => {
    this.setState({ isEditModalVisible: true, patientContactToEdit });
  };

  handleCloseModal = () => {
    this.setState({ isEditModalVisible: false, patientContactToEdit: null });
  };

  renderEditModal() {
    const { patientId } = this.props;
    const { isEditModalVisible, patientContactToEdit } = this.state;

    if (patientContactToEdit) {
      return (
        <EditPatientContactModal
          isVisible={isEditModalVisible}
          closePopup={this.handleCloseModal}
          patientContact={patientContactToEdit}
          patientId={patientId}
          contactType="familyMember"
          onSaved={this.handleEditSuccess}
          titleMessageId="patientContact.editFamily"
          subTitleMessageId="patientContact.familySubtitle"
        />
      );
    }

    return null;
  }

  renderCareTeamMembers() {
    const { isLoading } = this.props;
    const patientContacts = this.props.patientContacts || [];

    if (isLoading || !patientContacts.length) {
      return null;
    }

    return patientContacts.map(patientContact => (
      <PatientFamilyMember
        key={patientContact.id}
        patientContact={patientContact}
        onRemoveClick={this.handleRemove}
        onEditClick={this.handleOpenEditModal}
      />
    ));
  }

  render(): JSX.Element {
    const { onAddEmergencyContact, patientContacts } = this.props;
    const emergencyContact =
      patientContacts && patientContacts.find(contact => contact.isEmergencyContact);
    const placeholder = !emergencyContact ? (
      <RequiredPlaceholder
        onClick={onAddEmergencyContact}
        headerMessageId="patientTeam.missingEmergencyHeader"
        subtextMessageId="patientTeam.missingEmergencySubtext"
      />
    ) : null;

    return (
      <div className={styles.container}>
        {placeholder}
        {this.renderCareTeamMembers()}
        {this.renderEditModal()}
      </div>
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(patientContactDeleteMutationGraphql as any, {
    name: 'patientContactDelete',
    options: {
      refetchQueries: ['getPatientContacts'],
    },
  }),
  graphql<IGraphqlProps, IProps, allProps>(patientContactsQuery as any, {
    options: (props: IProps) => ({
      variables: {
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      isLoading: data ? data.loading : false,
      error: data ? data.error : null,
      patientContacts: data ? (data as any).patientContacts : null,
    }),
  }),
)(PatientFamilyTeam);
