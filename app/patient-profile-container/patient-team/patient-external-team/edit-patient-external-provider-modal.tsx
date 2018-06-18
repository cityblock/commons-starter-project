import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import getPatientExternalProvidersQuery from '../../../graphql/queries/get-patient-external-providers.graphql';
import getPatientQuery from '../../../graphql/queries/get-patient.graphql';
import editPatientExternalProviderMutationGraphql from '../../../graphql/queries/patient-external-provider-edit-mutation.graphql';
import {
  patientExternalProviderEditMutation,
  patientExternalProviderEditMutationVariables,
  FullPatientExternalProviderFragment,
} from '../../../graphql/types';
import PatientExternalProviderModal, {
  IPatientExternalProvider,
} from './patient-external-provider-modal';

interface IProps {
  patientExternalProvider: FullPatientExternalProviderFragment;
  patientId: string;
  isVisible: boolean;
  closePopup: () => void;
}

interface IGraphqlProps {
  editPatientExternalProviderMutation: (
    options: { variables: patientExternalProviderEditMutationVariables },
  ) => Promise<{ data: patientExternalProviderEditMutation; errors?: ApolloError[] }>;
}

type allProps = IProps & IGraphqlProps;

export class EditPatientExternalProviderModal extends React.Component<allProps> {
  editPatientExternalProvider = async (provider: IPatientExternalProvider) => {
    const { editPatientExternalProviderMutation, patientExternalProvider } = this.props;

    let roleFreeText = null;
    if (provider.role === 'other' || provider.role === 'otherMedicalSpecialist') {
      roleFreeText = provider.roleFreeText;
    }

    // edit patient external provider
    return editPatientExternalProviderMutation({
      variables: {
        ...provider,
        patientExternalProviderId: patientExternalProvider.id,
        roleFreeText,
      },
    });
  };

  render() {
    const { patientExternalProvider, isVisible, closePopup, patientId } = this.props;

    return (
      <PatientExternalProviderModal
        patientId={patientId}
        isVisible={isVisible}
        patientExternalProvider={patientExternalProvider}
        saveExternalProvider={this.editPatientExternalProvider}
        closePopup={closePopup}
        titleMessageId="patientExternalProvider.editModalTitle"
        subTitleMessageId="patientExternalProvider.modalSubTitle"
      />
    );
  }
}

export default graphql<any>(editPatientExternalProviderMutationGraphql, {
  name: 'editPatientExternalProviderMutation',
  options: (props: IProps) => ({
    refetchQueries: [
      {
        query: getPatientExternalProvidersQuery,
        variables: {
          patientId: props.patientId,
        },
      },
      {
        query: getPatientQuery,
        variables: {
          patientId: props.patientId,
        },
      },
    ],
  }),
})(EditPatientExternalProviderModal) as React.ComponentClass<IProps>;
