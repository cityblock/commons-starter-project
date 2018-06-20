import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import getPatientExternalProviders from '../../../graphql/queries/get-patient-external-providers.graphql';
import getPatient from '../../../graphql/queries/get-patient.graphql';
import editPatientExternalProviderGraphql from '../../../graphql/queries/patient-external-provider-edit-mutation.graphql';
import {
  patientExternalProviderEdit,
  patientExternalProviderEditVariables,
  FullPatientExternalProvider,
} from '../../../graphql/types';
import PatientExternalProviderModal, {
  IPatientExternalProvider,
} from './patient-external-provider-modal';

interface IProps {
  patientExternalProvider: FullPatientExternalProvider;
  patientId: string;
  isVisible: boolean;
  closePopup: () => void;
}

interface IGraphqlProps {
  editPatientExternalProvider: (
    options: { variables: patientExternalProviderEditVariables },
  ) => Promise<{ data: patientExternalProviderEdit; errors?: ApolloError[] }>;
}

type allProps = IProps & IGraphqlProps;

export class EditPatientExternalProviderModal extends React.Component<allProps> {
  editPatientExternalProvider = async (provider: IPatientExternalProvider) => {
    const { editPatientExternalProvider, patientExternalProvider } = this.props;

    let roleFreeText = null;
    if (provider.role === 'other' || provider.role === 'otherMedicalSpecialist') {
      roleFreeText = provider.roleFreeText;
    }

    // edit patient external provider
    return editPatientExternalProvider({
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

export default graphql<any>(editPatientExternalProviderGraphql, {
  name: 'editPatientExternalProvider',
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
})(EditPatientExternalProviderModal) as React.ComponentClass<IProps>;
