import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import getPatientExternalOrganizationsQuery from '../../../graphql/queries/get-patient-external-organizations.graphql';
import getPatientQuery from '../../../graphql/queries/get-patient.graphql';
import createPatientExternalOrganizationMutationGraphql from '../../../graphql/queries/patient-external-organization-create-mutation.graphql';
import {
  patientExternalOrganizationCreateMutation,
  patientExternalOrganizationCreateMutationVariables,
} from '../../../graphql/types';
import PatientExternalOrganizationModal, {
  IPatientExternalOrganization,
} from './patient-external-organization-modal';

interface IProps {
  patientId: string;
  isVisible: boolean;
  closePopup: () => void;
}

interface IGraphqlProps {
  createPatientExternalOrganizationMutation: (
    options: { variables: patientExternalOrganizationCreateMutationVariables },
  ) => Promise<{ data: patientExternalOrganizationCreateMutation; errors: ApolloError[] }>;
}

type allProps = IProps & IGraphqlProps;

export class CreatePatientExternalOrganizationModal extends React.Component<allProps> {
  createPatientExternalOrganization = async (organization: IPatientExternalOrganization) => {
    const { createPatientExternalOrganizationMutation, patientId } = this.props;

    // create patient external organization
    return createPatientExternalOrganizationMutation({
      variables: {
        ...organization,
        patientId,
      },
    });
  };

  render() {
    const { isVisible, closePopup, patientId } = this.props;

    return (
      <PatientExternalOrganizationModal
        patientId={patientId}
        isVisible={isVisible}
        saveExternalOrganization={this.createPatientExternalOrganization}
        closePopup={closePopup}
        titleMessageId="patientExternalOrganization.createModalTitle"
        subTitleMessageId="patientExternalOrganization.modalSubTitle"
      />
    );
  }
}

export default graphql(createPatientExternalOrganizationMutationGraphql, {
  name: 'createPatientExternalOrganizationMutation',
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
})(CreatePatientExternalOrganizationModal as any);
