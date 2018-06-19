import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import getPatientExternalOrganizationsQuery from '../../../graphql/queries/get-patient-external-organizations.graphql';
import getPatientQuery from '../../../graphql/queries/get-patient.graphql';
import editPatientExternalOrganizationMutationGraphql from '../../../graphql/queries/patient-external-organization-edit-mutation.graphql';
import {
  patientExternalOrganizationEditMutation,
  patientExternalOrganizationEditMutationVariables,
  FullPatientExternalOrganizationFragment,
} from '../../../graphql/types';
import PatientExternalOrganizationModal, {
  IPatientExternalOrganization,
} from './patient-external-organization-modal';

interface IProps {
  patientExternalOrganization: FullPatientExternalOrganizationFragment;
  patientId: string;
  isVisible: boolean;
  closePopup: () => void;
}

interface IGraphqlProps {
  editPatientExternalOrganizationMutation: (
    options: { variables: patientExternalOrganizationEditMutationVariables },
  ) => Promise<{ data: patientExternalOrganizationEditMutation; errors?: ApolloError[] }>;
}

type allProps = IProps & IGraphqlProps;

export class EditPatientExternalOrganizationModal extends React.Component<allProps> {
  editPatientExternalOrganization = async (organization: IPatientExternalOrganization) => {
    const { editPatientExternalOrganizationMutation, patientExternalOrganization } = this.props;

    // edit patient external organization
    return editPatientExternalOrganizationMutation({
      variables: {
        ...organization,
        patientExternalOrganizationId: patientExternalOrganization.id,
      },
    });
  };

  render() {
    const { patientExternalOrganization, isVisible, closePopup, patientId } = this.props;

    return (
      <PatientExternalOrganizationModal
        patientId={patientId}
        isVisible={isVisible}
        patientExternalOrganization={patientExternalOrganization}
        saveExternalOrganization={this.editPatientExternalOrganization}
        closePopup={closePopup}
        titleMessageId="patientExternalOrganization.editModalTitle"
        subTitleMessageId="patientExternalOrganization.modalSubTitle"
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
      {
        query: getPatientQuery,
        variables: {
          patientId: props.patientId,
        },
      },
    ],
  }),
})(EditPatientExternalOrganizationModal) as React.ComponentClass<IProps>;
