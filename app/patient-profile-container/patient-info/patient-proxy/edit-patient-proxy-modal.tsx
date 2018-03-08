import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as createEmailMutationGraphql from '../../../graphql/queries/email-create-mutation.graphql';
import * as editEmailMutationGraphql from '../../../graphql/queries/email-edit-mutation.graphql';
import * as editPatientContactMutationGraphql from '../../../graphql/queries/patient-contact-edit-mutation.graphql';
import * as editPhoneMutationGraphql from '../../../graphql/queries/phone-edit-mutation.graphql';
import {
  emailCreateMutation,
  emailCreateMutationVariables,
  emailEditMutation,
  emailEditMutationVariables,
  patientContactEditMutation,
  patientContactEditMutationVariables,
  phoneEditMutation,
  phoneEditMutationVariables,
  FullPatientContactFragment,
} from '../../../graphql/types';
import PatientProxyModal, { IPatientProxy } from './patient-proxy-modal';

interface IProps {
  onSaved: (patientContact: patientContactEditMutation['patientContactEdit']) => void;
  patientProxy: FullPatientContactFragment;
  patientId: string;
  isVisible: boolean;
  closePopup: () => void;
}

interface IGraphqlProps {
  createEmailMutation: (
    options: { variables: emailCreateMutationVariables },
  ) => { data: emailCreateMutation };
  editEmailMutation: (
    options: { variables: emailEditMutationVariables },
  ) => { data: emailEditMutation };
  editPatientContactMutation: (
    options: { variables: patientContactEditMutationVariables },
  ) => { data: patientContactEditMutation };
  editPhoneMutation: (
    options: { variables: phoneEditMutationVariables },
  ) => { data: phoneEditMutation };
}

type allProps = IProps & IGraphqlProps;

export class EditPatientProxyModal extends React.Component<allProps> {
  editPatientProxy = async (proxy: IPatientProxy) => {
    const {
      editPatientContactMutation,
      editEmailMutation,
      editPhoneMutation,
      createEmailMutation,
      patientId,
      patientProxy,
    } = this.props;
    const promises = [];

    // create or update email (optional)
    let emailResponse;
    if (proxy.emailAddress) {
      if (
        patientProxy.primaryEmail &&
        proxy.emailAddress !== patientProxy.primaryEmail.emailAddress
      ) {
        promises.push(
          editEmailMutation({
            variables: {
              patientId,
              emailId: patientProxy.primaryEmail.id,
              emailAddress: proxy.emailAddress,
            },
          }),
        );
      } else if (!patientProxy.primaryEmail) {
        emailResponse = await createEmailMutation({
          variables: {
            emailAddress: proxy.emailAddress,
          },
        });

        if (!emailResponse.data.emailCreate) {
          return emailResponse;
        }
      }
    }
    const primaryEmailId =
      emailResponse && emailResponse.data.emailCreate ? emailResponse.data.emailCreate.id : null;

    // update phone number (optional)
    if (proxy.phoneNumber !== patientProxy.primaryPhone.phoneNumber) {
      promises.push(
        editPhoneMutation({
          variables: {
            patientId,
            phoneId: patientProxy.primaryPhone.id,
            phoneNumber: proxy.phoneNumber,
          },
        }),
      );
    }

    // edit patient contact healthcare proxy
    await Promise.all(promises);
    return editPatientContactMutation({
      variables: {
        patientContactId: patientProxy.id,
        firstName: proxy.firstName,
        lastName: proxy.lastName,
        relationToPatient: proxy.relationToPatient,
        description: proxy.description,
        primaryEmailId,
      },
    });
  };

  handlePatientProxySaved = (response: { data: patientContactEditMutation }) => {
    if (response.data.patientContactEdit) {
      this.props.onSaved(response.data.patientContactEdit);
    }
  };

  render() {
    const { patientProxy, isVisible, closePopup } = this.props;

    return (
      <PatientProxyModal
        isVisible={isVisible}
        patientProxy={patientProxy}
        saveProxy={this.editPatientProxy}
        onSaved={this.handlePatientProxySaved}
        closePopup={closePopup}
        titleMessageId="patientContact.editHealthcareProxy"
      />
    );
  }
}

export default compose(
  graphql<IGraphqlProps, IProps, allProps>(createEmailMutationGraphql as any, {
    name: 'createEmailMutation',
  }),
  graphql<IGraphqlProps, IProps, allProps>(editPatientContactMutationGraphql as any, {
    name: 'editPatientContactMutation',
  }),
  graphql<IGraphqlProps, IProps, allProps>(editEmailMutationGraphql as any, {
    name: 'editEmailMutation',
  }),
  graphql<IGraphqlProps, IProps, allProps>(editPhoneMutationGraphql as any, {
    name: 'editPhoneMutation',
  }),
)(EditPatientProxyModal);
