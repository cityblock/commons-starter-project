import React from 'react';
import { graphql } from 'react-apollo';
import editPatientContactGraphql from '../../graphql/queries/patient-contact-edit-mutation.graphql';
import {
  patientContactEdit,
  patientContactEditVariables,
  FullPatientContact,
} from '../../graphql/types';
import PatientContactModal, { ContactType } from './patient-contact-modal';

interface IProps {
  onSaved: (patientContact: FullPatientContact) => void;
  patientContact: FullPatientContact;
  patientId: string;
  contactType: ContactType;
  isVisible: boolean;
  closePopup: () => void;
  subTitleMessageId?: string;
  titleMessageId?: string;
}

interface IGraphqlProps {
  editPatientContact: (
    options: { variables: patientContactEditVariables },
  ) => { data: patientContactEdit };
}

type allProps = IProps & IGraphqlProps;

export class EditPatientContactModal extends React.Component<allProps> {
  editPatientContact = async (contact: patientContactEditVariables) => {
    const { editPatientContact, patientContact } = this.props;

    let relationFreeText = null;
    if (contact.relationToPatient === 'other') {
      relationFreeText = contact.relationFreeText;
    }

    // edit patient contact healthcare contact
    return editPatientContact({
      variables: {
        ...contact,
        patientContactId: patientContact.id,
        relationFreeText,
      },
    });
  };

  handlePatientContactSaved = (response: { data: patientContactEdit }) => {
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

export default graphql<any>(editPatientContactGraphql, {
  name: 'editPatientContact',
  options: {
    refetchQueries: ['getPatientContacts', 'getPatientComputedPatientStatus', 'getPatient'],
  },
})(EditPatientContactModal) as React.ComponentClass<IProps>;
