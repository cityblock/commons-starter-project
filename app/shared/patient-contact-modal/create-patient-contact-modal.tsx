import * as React from 'react';
import { graphql } from 'react-apollo';
import * as createPatientContactMutationGraphql from '../../graphql/queries/patient-contact-create-mutation.graphql';
import {
  patientContactCreateMutation,
  patientContactCreateMutationVariables,
  FullPatientContactFragment,
} from '../../graphql/types';
import PatientContactModal, { ContactType, IPatientContact } from './patient-contact-modal';

interface IProps {
  onSaved: (patientContact: FullPatientContactFragment) => void;
  isVisible: boolean;
  patientId: string;
  contactType: ContactType;
  closePopup: () => void;
  titleMessageId: string;
  subTitleMessageId?: string;
}

interface IGraphqlProps {
  createPatientContactMutation: (
    options: { variables: patientContactCreateMutationVariables },
  ) => { data: patientContactCreateMutation };
}

type allProps = IProps & IGraphqlProps;

export class CreatePatientContactModal extends React.Component<allProps> {
  createPatientContact = async (contact: IPatientContact) => {
    const { createPatientContactMutation, patientId } = this.props;

    // create patient contact heathcare proxy
    return createPatientContactMutation({
      variables: {
        ...contact,
        patientId,
      },
    });
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

export default graphql<IGraphqlProps, IProps, allProps>(
  createPatientContactMutationGraphql as any,
  {
    name: 'createPatientContactMutation',
    options: {
      refetchQueries: ['getPatientContacts'],
    },
  },
)(CreatePatientContactModal);
