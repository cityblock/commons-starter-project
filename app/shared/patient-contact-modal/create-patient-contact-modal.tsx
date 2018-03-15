import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as createPatientContactMutationGraphql from '../../graphql/queries/patient-contact-create-mutation.graphql';
import * as editPatientInfoMutationGraphql from '../../graphql/queries/patient-info-edit-mutation.graphql';
import {
  patientContactCreateMutation,
  patientContactCreateMutationVariables,
  patientInfoEditMutation,
  patientInfoEditMutationVariables,
  FullPatientContactFragment,
} from '../../graphql/types';
import PatientContactModal, { ContactType, IPatientContact } from './patient-contact-modal';

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
  createPatientContact = async (contact: IPatientContact) => {
    const {
      createPatientContactMutation,
      editPatientInfoMutation,
      patientId,
      patientInfoId,
      contactType,
    } = this.props;

    // create patient contact heathcare proxy
    const response = await createPatientContactMutation({
      variables: {
        ...contact,
        patientId,
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
  graphql<IGraphqlProps, IProps, allProps>(createPatientContactMutationGraphql as any, {
    name: 'createPatientContactMutation',
    options: {
      refetchQueries: ['getPatientContacts', 'getPatientComputedPatientStatus', 'getPatient'],
    },
  }),
  graphql<IGraphqlProps, IProps, allProps>(editPatientInfoMutationGraphql as any, {
    name: 'editPatientInfoMutation',
    options: {
      refetchQueries: ['getPatientComputedPatientStatus', 'getPatientComputedPatientStatus'],
    },
  }),
)(CreatePatientContactModal);
