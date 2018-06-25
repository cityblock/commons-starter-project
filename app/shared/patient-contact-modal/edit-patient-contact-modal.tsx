import React from 'react';
import { graphql } from 'react-apollo';
import patientComputedPatientStatusGraphql from '../../graphql/queries/get-patient-computed-patient-status.graphql';
import patientContactsGraphql from '../../graphql/queries/get-patient-contacts.graphql';
import patientGraphql from '../../graphql/queries/get-patient.graphql';
import editPatientContactGraphql from '../../graphql/queries/patient-contact-edit-mutation.graphql';
import {
  patientContactEdit,
  patientContactEditVariables,
  FullPatientContact,
} from '../../graphql/types';
import PatientContactModal, { ContactType } from './patient-contact-modal';

interface IProps {
  patientContact: FullPatientContact;
  patientId: string;
  contactType: ContactType;
  isVisible: boolean;
  closePopup: () => void;
  onSaved?: (patientContact: FullPatientContact) => void;
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
    const { onSaved } = this.props;
    if (response.data.patientContactEdit && onSaved) {
      onSaved(response.data.patientContactEdit);
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
  options: (props: IProps) => ({
    refetchQueries: [
      {
        query: patientContactsGraphql,
        variables: {
          patientId: props.patientId,
        },
      },
      {
        query: patientComputedPatientStatusGraphql,
        variables: {
          patientId: props.patientId,
        },
      },
      {
        query: patientGraphql,
        variables: {
          patientId: props.patientId,
        },
      },
    ],
  }),
})(EditPatientContactModal) as React.ComponentClass<IProps>;
