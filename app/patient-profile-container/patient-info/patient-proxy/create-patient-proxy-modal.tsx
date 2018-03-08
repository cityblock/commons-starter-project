import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as createEmailMutationGraphql from '../../../graphql/queries/email-create-mutation.graphql';
import * as createPatientContactMutationGraphql from '../../../graphql/queries/patient-contact-create-mutation.graphql';
import * as createPhoneMutationGraphql from '../../../graphql/queries/phone-create-mutation.graphql';
import {
  emailCreateMutation,
  emailCreateMutationVariables,
  patientContactCreateMutation,
  patientContactCreateMutationVariables,
  phoneCreateMutation,
  phoneCreateMutationVariables,
} from '../../../graphql/types';
import PatientProxyModal, { IPatientProxy } from './patient-proxy-modal';

interface IProps {
  onSaved: (patientContact: patientContactCreateMutation['patientContactCreate']) => void;
  isVisible: boolean;
  patientId: string;
  closePopup: () => void;
}

interface IGraphqlProps {
  createEmailMutation: (
    options: { variables: emailCreateMutationVariables },
  ) => { data: emailCreateMutation };
  createPatientContactMutation: (
    options: { variables: patientContactCreateMutationVariables },
  ) => { data: patientContactCreateMutation };
  createPhoneMutation: (
    options: { variables: phoneCreateMutationVariables },
  ) => { data: phoneCreateMutation };
}

type allProps = IProps & IGraphqlProps;

export class CreatePatientProxyModal extends React.Component<allProps> {
  createPatientProxy = async (proxy: IPatientProxy) => {
    const {
      createPatientContactMutation,
      createPhoneMutation,
      createEmailMutation,
      patientId,
    } = this.props;

    // create email (optional)
    let emailResponse;
    if (proxy.emailAddress) {
      emailResponse = await createEmailMutation({
        variables: {
          emailAddress: proxy.emailAddress,
        },
      });

      if (!emailResponse.data.emailCreate) {
        return emailResponse;
      }
    }
    const primaryEmailId =
      emailResponse && emailResponse.data.emailCreate ? emailResponse.data.emailCreate.id : null;

    // create phone number (required)
    const phoneResponse = await createPhoneMutation({
      variables: {
        phoneNumber: proxy.phoneNumber,
      },
    });

    if (!phoneResponse.data.phoneCreate) {
      return phoneResponse;
    }

    // create patient contact heathcare proxy
    return createPatientContactMutation({
      variables: {
        patientId,
        firstName: proxy.firstName,
        lastName: proxy.lastName,
        relationToPatient: proxy.relationToPatient,
        description: proxy.description,
        primaryPhoneId: phoneResponse.data.phoneCreate.id,
        primaryEmailId,
        isHealthcareProxy: true,
      },
    });
  };

  handlePatientProxySaved = (response: { data: patientContactCreateMutation }) => {
    if (response.data.patientContactCreate) {
      this.props.onSaved(response.data.patientContactCreate);
    }
  };

  render() {
    const { isVisible, closePopup } = this.props;

    return (
      <PatientProxyModal
        isVisible={isVisible}
        saveProxy={this.createPatientProxy}
        onSaved={this.handlePatientProxySaved}
        closePopup={closePopup}
        titleMessageId="patientContact.addHealthcareProxy"
      />
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(createEmailMutationGraphql as any, {
    name: 'createEmailMutation',
  }),
  graphql<IGraphqlProps, IProps, allProps>(createPatientContactMutationGraphql as any, {
    name: 'createPatientContactMutation',
  }),
  graphql<IGraphqlProps, IProps, allProps>(createPhoneMutationGraphql as any, {
    name: 'createPhoneMutation',
  }),
)(CreatePatientProxyModal);
