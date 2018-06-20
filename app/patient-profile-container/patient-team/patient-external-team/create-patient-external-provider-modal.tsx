import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import getPatientExternalProviders from '../../../graphql/queries/get-patient-external-providers.graphql';
import getPatient from '../../../graphql/queries/get-patient.graphql';
import createPatientExternalProviderGraphql from '../../../graphql/queries/patient-external-provider-create-mutation.graphql';
import {
  patientExternalProviderCreate,
  patientExternalProviderCreateVariables,
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
  createPatientExternalProvider: (
    options: { variables: patientExternalProviderCreateVariables },
  ) => Promise<{ data: patientExternalProviderCreate; errors: ApolloError[] }>;
}

type allProps = IProps & IGraphqlProps;

export class CreatePatientExternalProviderModal extends React.Component<allProps> {
  createPatientExternalProvider = async (provider: IPatientExternalProvider) => {
    const { createPatientExternalProvider, patientId } = this.props;

    let roleFreeText = null;
    if (provider.role === 'other' || provider.role === 'otherMedicalSpecialist') {
      roleFreeText = provider.roleFreeText;
    }

    // create patient external provider
    return createPatientExternalProvider({
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

export default graphql(createPatientExternalProviderGraphql, {
  name: 'createPatientExternalProvider',
  options: (props: IProps) => ({
    refetchQueries: [
      {
        query: getPatientExternalProviders,
        variables: {
          patientId: props.patientId,
        },
      },
      {
        query: getPatient,
        variables: {
          patientId: props.patientId,
        },
      },
    ],
  }),
})(CreatePatientExternalProviderModal as any);
