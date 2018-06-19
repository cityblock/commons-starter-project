import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql, Mutation, MutationFn } from 'react-apollo';
import patientExternalOrganizationsQuery from '../../../graphql/queries/get-patient-external-organizations.graphql';
import patientExternalOrganizationDeleteMutationGraphql from '../../../graphql/queries/patient-external-organization-delete-mutation.graphql';
import {
  getPatientExternalOrganizationsQuery,
  FullPatientExternalOrganizationFragment,
} from '../../../graphql/types';
import EmptyPlaceholder from '../../../shared/library/empty-placeholder/empty-placeholder';
import styles from '../css/patient-team.css';
import EditPatientExternalOrganizationModal from './edit-patient-external-organization-modal';
import PatientExternalOrganization from './patient-external-organization';

interface IProps {
  patientId: string;
}

interface IGraphqlProps {
  patientExternalOrganizations?: getPatientExternalOrganizationsQuery['patientExternalOrganizations'];
  isLoading?: boolean;
  error?: ApolloError | null;
}

export type allProps = IGraphqlProps & IProps;

interface IState {
  isEditModalVisible: boolean;
  patientExternalOrganizationToEdit?: FullPatientExternalOrganizationFragment | null;
  error?: string | null;
}

export class PatientExternalOrganizations extends React.Component<allProps, IState> {
  state = { isEditModalVisible: false, patientExternalOrganizationToEdit: undefined };

  handleRemove = async (patientExternalOrganizationId: string, mutate: MutationFn) => {
    try {
      const response = await mutate({
        variables: { patientExternalOrganizationId },
        refetchQueries: ['getPatientExternalOrganizations'],
      });
      this.setState({
        error: (response as any).errors ? (response as any).errors[0] : null,
      });
    } catch (err) {
      // TODO: handle errors
    }
  };

  handleOpenEditModal = (
    patientExternalOrganizationToEdit: FullPatientExternalOrganizationFragment,
  ) => {
    this.setState({ isEditModalVisible: true, patientExternalOrganizationToEdit });
  };

  handleCloseModal = () => {
    this.setState({ isEditModalVisible: false, patientExternalOrganizationToEdit: null });
  };

  renderEditModal() {
    const { patientId } = this.props;
    const { isEditModalVisible, patientExternalOrganizationToEdit } = this.state;

    if (patientExternalOrganizationToEdit) {
      return (
        <EditPatientExternalOrganizationModal
          isVisible={isEditModalVisible}
          closePopup={this.handleCloseModal}
          patientExternalOrganization={patientExternalOrganizationToEdit}
          patientId={patientId}
        />
      );
    }

    return null;
  }

  renderOrganizations() {
    const { isLoading } = this.props;
    const patientExternalOrganizations = this.props.patientExternalOrganizations || [];

    if (isLoading) {
      return null;
    }

    if (!patientExternalOrganizations.length) {
      return (
        <EmptyPlaceholder
          headerMessageId="patientTeam.externalOrganizationsEmptyTitle"
          detailMessageId="patientTeam.externalOrganizationsEmptyDetail"
          icon="inbox"
        />
      );
    }

    return patientExternalOrganizations.map(patientExternalOrganization => (
      <Mutation
        mutation={patientExternalOrganizationDeleteMutationGraphql}
        key={`mutation-${patientExternalOrganization.id}`}
      >
        {mutate => (
          <PatientExternalOrganization
            key={patientExternalOrganization.id}
            patientExternalOrganization={patientExternalOrganization}
            onRemoveClick={async patientExternalOrganizationId =>
              this.handleRemove(patientExternalOrganizationId, mutate)
            }
            onEditClick={this.handleOpenEditModal}
          />
        )}
      </Mutation>
    ));
  }

  render(): JSX.Element {
    return (
      <div className={styles.container}>
        {this.renderOrganizations()}
        {this.renderEditModal()}
      </div>
    );
  }
}

export default graphql(patientExternalOrganizationsQuery, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.patientId,
    },
  }),
  props: ({ data }): IGraphqlProps => ({
    isLoading: data ? data.loading : false,
    error: data ? data.error : null,
    patientExternalOrganizations: data ? (data as any).patientExternalOrganizations : null,
  }),
})(PatientExternalOrganizations);
