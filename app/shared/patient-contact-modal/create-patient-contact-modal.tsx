import React from 'react';
import { compose, graphql } from 'react-apollo';
import createPatientContactGraphql from '../../graphql/queries/patient-contact-create-mutation.graphql';
import editPatientInfoGraphql from '../../graphql/queries/patient-info-edit-mutation.graphql';
import {
  patientContactCreate,
  patientContactCreateVariables,
  patientInfoEdit,
  patientInfoEditVariables,
  FullPatientContact,
} from '../../graphql/types';
import PatientContactModal, { ContactType } from './patient-contact-modal';

interface IProps {
  onSaved: (patientContact: FullPatientContact) => void;
  isVisible: boolean;
  patientId: string;
  patientInfoId?: string;
  contactType: ContactType;
  closePopup: () => void;
  titleMessageId: string;
  subTitleMessageId?: string;
}

interface IGraphqlProps {
  createPatientContact: (
    options: { variables: patientContactCreateVariables },
  ) => { data: patientContactCreate };
  editPatientInfo: (options: { variables: patientInfoEditVariables }) => { data: patientInfoEdit };
}

type allProps = IProps & IGraphqlProps;

export class CreatePatientContactModal extends React.Component<allProps> {
  createPatientContact = async (patientContact: patientContactCreateVariables) => {
    const {
      createPatientContact,
      editPatientInfo,
      patientId,
      patientInfoId,
      contactType,
    } = this.props;

    let relationFreeText = null;
    if (patientContact.relationToPatient === 'other') {
      relationFreeText = patientContact.relationFreeText;
    }

    // create patient contact heathcare proxy
    const response = await createPatientContact({
      variables: {
        ...patientContact,
        patientId,
        relationFreeText,
      },
    });

    if (contactType === 'healthcareProxy' && patientInfoId) {
      await editPatientInfo({
        variables: {
          patientInfoId,
          hasHealthcareProxy: true,
        },
      });
    }

    return response;
  };

  handlePatientContactSaved = (response: { data: patientContactCreate }) => {
    if (response.data.patientContactCreate) {
      this.props.onSaved(response.data.patientContactCreate);
    }
  };

  render() {
    const { isVisible, closePopup, contactType, titleMessageId, subTitleMessageId } = this.props;

    return (
      <PatientContactModal
        isVisible={isVisible}
        saveContact={this.createPatientContact}
        onSaved={this.handlePatientContactSaved}
        closePopup={closePopup}
        titleMessageId={titleMessageId}
        subTitleMessageId={subTitleMessageId}
        contactType={contactType}
      />
    );
  }
}

export default compose(
  graphql(createPatientContactGraphql, {
    name: 'createPatientContact',
    options: {
      refetchQueries: ['getPatientContacts', 'getPatientComputedPatientStatus', 'getPatient'],
    },
  }),
  graphql(editPatientInfoGraphql, {
    name: 'editPatientInfo',
    options: {
      refetchQueries: ['getPatientComputedPatientStatus', 'getPatientComputedPatientStatus'],
    },
  }),
)(CreatePatientContactModal) as React.ComponentClass<IProps>;
