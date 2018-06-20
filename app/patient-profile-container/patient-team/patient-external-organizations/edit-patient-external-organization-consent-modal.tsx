import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import getPatientExternalOrganizationsQuery from '../../../graphql/queries/get-patient-external-organizations.graphql';
import editPatientExternalOrganizationMutationGraphql from '../../../graphql/queries/patient-external-organization-edit-mutation.graphql';
import {
  patientExternalOrganizationEdit,
  patientExternalOrganizationEditVariables,
  FullPatientExternalOrganization,
} from '../../../graphql/types';
import ConsentModal from '../consent-modal';
import { getConsentSettingsObject, IConsentSettings } from '../helpers/consent-helpers';

interface IProps {
  patientExternalOrganization: FullPatientExternalOrganization;
  patientId: string;
  isVisible: boolean;
  closePopup: () => void;
}

interface IGraphqlProps {
  editPatientExternalOrganizationMutation: (
    options: { variables: patientExternalOrganizationEditVariables },
  ) => Promise<{ data: patientExternalOrganizationEdit; errors?: ApolloError[] }>;
}

type allProps = IProps & IGraphqlProps;

export class EditPatientExternalOrganizationConsentModal extends React.Component<allProps> {
  editPatientExternalOrganization = async (consentSettings: IConsentSettings) => {
    const { editPatientExternalOrganizationMutation, patientExternalOrganization } = this.props;

    // edit patient external organization
    return editPatientExternalOrganizationMutation({
      variables: {
        ...consentSettings,
        patientExternalOrganizationId: patientExternalOrganization.id,
      },
    });
  };

  render() {
    const { patientExternalOrganization, isVisible, closePopup } = this.props;
    const consentSettings = getConsentSettingsObject(patientExternalOrganization);

    return (
      <ConsentModal
        consenterId={patientExternalOrganization.id}
        isVisible={isVisible}
        consentSettings={consentSettings}
        saveConsentSettings={this.editPatientExternalOrganization}
        closePopup={closePopup}
      />
    );
  }
}

export default graphql<any>(editPatientExternalOrganizationMutationGraphql, {
  name: 'editPatientExternalOrganizationMutation',
  options: (props: IProps) => ({
    refetchQueries: [
      {
        query: getPatientExternalOrganizationsQuery,
        variables: {
          patientId: props.patientId,
        },
      },
    ],
  }),
})(EditPatientExternalOrganizationConsentModal) as React.ComponentClass<IProps>;
