import React from 'react';
import { compose, graphql } from 'react-apollo';
import patientContactsGraphql from '../../../graphql/queries/get-patient-contacts.graphql';
import patientContactDeleteGraphql from '../../../graphql/queries/patient-contact-delete-mutation.graphql';
import {
  getPatientContacts,
  patientContactDelete,
  patientContactDeleteVariables,
  FullPatientContact,
} from '../../../graphql/types';
import EditPatientContactModal from '../../../shared/patient-contact-modal/edit-patient-contact-modal';
import withErrorHandler, {
  IInjectedErrorProps,
} from '../../../shared/with-error-handler/with-error-handler';
import RequiredPlaceholder from '../../required-placeholder';
import styles from '../css/patient-team.css';
import PatientFamilyMember from './patient-family-member';

interface IProps {
  patientId: string;
  onAddEmergencyContact: () => void;
}

interface IGraphqlProps {
  patientContacts?: getPatientContacts['patientContacts'];
  patientContactDelete: (
    options: { variables: patientContactDeleteVariables },
  ) => { data: patientContactDelete };
  isLoading?: boolean;
  error?: string | null;
}

export type allProps = IGraphqlProps & IProps & IInjectedErrorProps;

interface IState {
  isEditModalVisible: boolean;
  patientContactToEdit?: FullPatientContact | null;
}

export class PatientFamilyTeam extends React.Component<allProps, IState> {
  state = { isEditModalVisible: false, patientContactToEdit: undefined };

  handleRemove = async (patientContactId: string) => {
    const { openErrorPopup } = this.props;
    try {
      await this.props.patientContactDelete({ variables: { patientContactId } });
    } catch (err) {
      openErrorPopup(err.message);
    }
  };

  handleEditSuccess = () => {
    // TODO: get rid of these
  };

  handleOpenEditModal = (patientContactToEdit: FullPatientContact) => {
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
  withErrorHandler(),
  graphql(patientContactDeleteGraphql, {
    name: 'patientContactDelete',
    options: {
      refetchQueries: ['getPatientContacts'],
    },
  }),
  graphql(patientContactsGraphql, {
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
)(PatientFamilyTeam) as React.ComponentClass<IProps>;
