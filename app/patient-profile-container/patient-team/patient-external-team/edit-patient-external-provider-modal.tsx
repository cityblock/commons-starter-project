import * as React from 'react';
import { graphql } from 'react-apollo';
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
  ) => { data: patientExternalProviderEditMutation };
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

export default graphql<IGraphqlProps, IProps, allProps>(
  editPatientExternalProviderMutationGraphql as any,
  {
    name: 'editPatientExternalProviderMutation',
    options: {
      refetchQueries: ['getPatientExternalProviders', 'getPatient'],
    },
  },
)(EditPatientExternalProviderModal);
