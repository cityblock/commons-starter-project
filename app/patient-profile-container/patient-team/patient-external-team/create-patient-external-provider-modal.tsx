import * as React from 'react';
import { graphql } from 'react-apollo';
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

export default graphql<IGraphqlProps, IProps, allProps>(
  createPatientExternalProviderMutationGraphql as any,
  {
    name: 'createPatientExternalProviderMutation',
    options: {
      refetchQueries: ['getPatientExternalProviders', 'getPatient'],
    },
  },
)(CreatePatientExternalProviderModal);
