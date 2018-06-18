import React from 'react';
import { compose, graphql } from 'react-apollo';
import createPatientContactMutationGraphql from '../../graphql/queries/patient-contact-create-mutation.graphql';
import editPatientInfoMutationGraphql from '../../graphql/queries/patient-info-edit-mutation.graphql';
import {
  patientContactCreateMutation,
  patientContactCreateMutationVariables,
  patientInfoEditMutation,
  patientInfoEditMutationVariables,
  FullPatientContactFragment,
} from '../../graphql/types';
import PatientContactModal, { ContactType } from './patient-contact-modal';

interface IProps {
  onSaved: (patientContact: FullPatientContactFragment) => void;
  isVisible: boolean;
  patientId: string;
  patientInfoId?: string;
  contactType: ContactType;
  closePopup: () => void;
  titleMessageId: string;
  subTitleMessageId?: string;
}

interface IGraphqlProps {
  createPatientContactMutation: (
    options: { variables: patientContactCreateMutationVariables },
  ) => { data: patientContactCreateMutation };
  editPatientInfoMutation: (
    options: { variables: patientInfoEditMutationVariables },
  ) => { data: patientInfoEditMutation };
}

type allProps = IProps & IGraphqlProps;

export class CreatePatientContactModal extends React.Component<allProps> {
  createPatientContact = async (patientContact: patientContactCreateMutationVariables) => {
    const {
      createPatientContactMutation,
      editPatientInfoMutation,
      patientId,
      patientInfoId,
      contactType,
    } = this.props;

    let relationFreeText = null;
    if (patientContact.relationToPatient === 'other') {
      relationFreeText = patientContact.relationFreeText;
    }

    // create patient contact heathcare proxy
    const response = await createPatientContactMutation({
      variables: {
        ...patientContact,
        patientId,
        relationFreeText,
      },
    });

    if (contactType === 'healthcareProxy' && patientInfoId) {
      await editPatientInfoMutation({
        variables: {
          patientInfoId,
          hasHealthcareProxy: true,
        },
      });
    }

    return response;
  };

  handlePatientContactSaved = (response: { data: patientContactCreateMutation }) => {
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
  graphql(createPatientContactMutationGraphql, {
    name: 'createPatientContactMutation',
    options: {
      refetchQueries: ['getPatientContacts', 'getPatientComputedPatientStatus', 'getPatient'],
    },
  }),
  graphql(editPatientInfoMutationGraphql, {
    name: 'editPatientInfoMutation',
    options: {
      refetchQueries: ['getPatientComputedPatientStatus', 'getPatientComputedPatientStatus'],
    },
  }),
)(CreatePatientContactModal) as React.ComponentClass<IProps>;
