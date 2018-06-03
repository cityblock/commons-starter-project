import { ApolloError } from 'apollo-client';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as getPatientExternalProvidersQuery from '../../../graphql/queries/get-patient-external-providers.graphql';
import * as getPatientQuery from '../../../graphql/queries/get-patient.graphql';
import * as editPatientExternalProviderMutationGraphql from '../../../graphql/queries/patient-external-provider-edit-mutation.graphql';
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
    const { patientExternalProvider, isVisible, closePopup } = this.props;

    return (
      <PatientExternalProviderModal
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

export default graphql<any>(editPatientExternalProviderMutationGraphql as any, {
  name: 'editPatientExternalProviderMutation',
  options: (props: IProps) => ({
    refetchQueries: [
      {
        query: getPatientExternalProvidersQuery as any,
        variables: {
          patientId: props.patientId,
        },
      },
      {
        query: getPatientQuery as any,
        variables: {
          patientId: props.patientId,
        },
      },
    ],
  }),
})(EditPatientExternalProviderModal) as React.ComponentClass<IProps>;
