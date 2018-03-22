import * as React from 'react';
import { graphql } from 'react-apollo';
import * as editPatientContactMutationGraphql from '../../graphql/queries/patient-contact-edit-mutation.graphql';
import {
  patientContactEditMutation,
  patientContactEditMutationVariables,
  FullPatientContactFragment,
} from '../../graphql/types';
import PatientContactModal, { ContactType, IPatientContact } from './patient-contact-modal';

interface IProps {
  onSaved: (patientContact: FullPatientContactFragment) => void;
  patientContact: FullPatientContactFragment;
  patientId: string;
  contactType: ContactType;
  isVisible: boolean;
  closePopup: () => void;
  subTitleMessageId?: string;
  titleMessageId?: string;
}

interface IGraphqlProps {
  editPatientContactMutation: (
    options: { variables: patientContactEditMutationVariables },
  ) => { data: patientContactEditMutation };
}

type allProps = IProps & IGraphqlProps;

export class EditPatientContactModal extends React.Component<allProps> {
  editPatientContact = async (contact: IPatientContact) => {
    const { editPatientContactMutation, patientContact } = this.props;

    let relationFreeText = null;
    if (contact.relationToPatient === 'other') {
      relationFreeText = contact.relationFreeText;
    }

    // edit patient contact healthcare contact
    return editPatientContactMutation({
      variables: {
        ...contact,
        patientContactId: patientContact.id,
        relationFreeText,
      },
    });
  };

  handlePatientContactSaved = (response: { data: patientContactEditMutation }) => {
    if (response.data.patientContactEdit) {
      this.props.onSaved(response.data.patientContactEdit);
    }
  };

  render() {
    const {
      contactType,
      patientContact,
      isVisible,
      closePopup,
      titleMessageId,
      subTitleMessageId,
    } = this.props;

    return (
      <PatientContactModal
        isVisible={isVisible}
        patientContact={patientContact}
        saveContact={this.editPatientContact}
        onSaved={this.handlePatientContactSaved}
        closePopup={closePopup}
        titleMessageId={titleMessageId}
        subTitleMessageId={subTitleMessageId}
        contactType={contactType}
      />
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(editPatientContactMutationGraphql as any, {
  name: 'editPatientContactMutation',
  options: {
    refetchQueries: ['getPatientContacts', 'getPatientComputedPatientStatus', 'getPatient'],
  },
})(EditPatientContactModal);
