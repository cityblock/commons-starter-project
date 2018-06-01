import * as React from 'react';
import { graphql } from 'react-apollo';
import * as getPatientExternalProvidersQuery from '../../../graphql/queries/get-patient-external-providers.graphql';
import * as getPatientQuery from '../../../graphql/queries/get-patient.graphql';
import * as createPatientExternalProviderMutationGraphql from '../../../graphql/queries/patient-external-provider-create-mutation.graphql';
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
  ) => { data: patientExternalProviderCreateMutation };
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
    const { isVisible, closePopup } = this.props;

    return (
      <PatientExternalProviderModal
        isVisible={isVisible}
        saveExternalProvider={this.createPatientExternalProvider}
        closePopup={closePopup}
        titleMessageId="patientExternalProvider.createModalTitle"
        subTitleMessageId="patientExternalProvider.modalSubTitle"
      />
    );
  }
}

export default graphql(createPatientExternalProviderMutationGraphql as any, {
  name: 'createPatientExternalProviderMutation',
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
})(CreatePatientExternalProviderModal as any);
