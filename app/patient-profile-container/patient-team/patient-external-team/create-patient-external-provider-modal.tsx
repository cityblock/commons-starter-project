import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import getPatientExternalProvidersQuery from '../../../graphql/queries/get-patient-external-providers.graphql';
import getPatientQuery from '../../../graphql/queries/get-patient.graphql';
import createPatientExternalProviderMutationGraphql from '../../../graphql/queries/patient-external-provider-create-mutation.graphql';
import {
  patientExternalProviderCreateMutation,
  patientExternalProviderCreateMutationVariables,
} from '../../../graphql/types';
import PatientExternalProviderModal, {
  IPatientExternalProvider,
} from './patient-external-provider-modal';

interface IProps {
  patientId: string;
  isVisible: boolean;
  closePopup: () => void;
}

interface IGraphqlProps {
  createPatientExternalProviderMutation: (
    options: { variables: patientExternalProviderCreateMutationVariables },
  ) => Promise<{ data: patientExternalProviderCreateMutation; errors: ApolloError[] }>;
}

type allProps = IProps & IGraphqlProps;

export class CreatePatientExternalProviderModal extends React.Component<allProps> {
  createPatientExternalProvider = async (provider: IPatientExternalProvider) => {
    const { createPatientExternalProviderMutation, patientId } = this.props;

    let roleFreeText = null;
    if (provider.role === 'other' || provider.role === 'otherMedicalSpecialist') {
      roleFreeText = provider.roleFreeText;
    }

    // create patient external provider
    return createPatientExternalProviderMutation({
      variables: {
        ...provider,
        patientId,
        roleFreeText,
      },
    });
  };

  render() {
    const { isVisible, closePopup, patientId } = this.props;

    return (
      <PatientExternalProviderModal
        patientId={patientId}
        isVisible={isVisible}
        saveExternalProvider={this.createPatientExternalProvider}
        closePopup={closePopup}
        titleMessageId="patientExternalProvider.createModalTitle"
        subTitleMessageId="patientExternalProvider.modalSubTitle"
      />
    );
  }
}

export default graphql(createPatientExternalProviderMutationGraphql, {
  name: 'createPatientExternalProviderMutation',
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
})(CreatePatientExternalProviderModal as any);
