import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql, Mutation, MutationFn } from 'react-apollo';
import patientExternalOrganizationsGraphql from '../../../graphql/queries/get-patient-external-organizations.graphql';
import patientExternalOrganizationDeleteMutationGraphql from '../../../graphql/queries/patient-external-organization-delete-mutation.graphql';
import {
  getPatientExternalOrganizations,
  FullPatientExternalOrganization,
} from '../../../graphql/types';
import EmptyPlaceholder from '../../../shared/library/empty-placeholder/empty-placeholder';
import styles from '../css/patient-team.css';
import EditPatientExternalOrganizationConsentModal from './edit-patient-external-organization-consent-modal';
import EditPatientExternalOrganizationModal from './edit-patient-external-organization-modal';
import PatientExternalOrganization from './patient-external-organization';

interface IProps {
  patientId: string;
}

interface IGraphqlProps {
  patientExternalOrganizations?: getPatientExternalOrganizations['patientExternalOrganizations'];
  isLoading?: boolean;
  error?: ApolloError | null;
}

export type allProps = IGraphqlProps & IProps;

interface IState {
  isEditModalVisible: boolean;
  isEditConsentModalVisible: boolean;
  patientExternalOrganizationToEdit?: FullPatientExternalOrganization | null;
  error?: string | null;
}

export class PatientExternalOrganizations extends React.Component<allProps, IState> {
  state = {
    isEditModalVisible: false,
    isEditConsentModalVisible: false,
    patientExternalOrganizationToEdit: undefined,
  };

  handleRemove = async (patientExternalOrganizationId: string, mutate: MutationFn) => {
    try {
      const response = await mutate({
        variables: { patientExternalOrganizationId },
        refetchQueries: [
          {
            query: patientExternalOrganizationsGraphql,
            variables: {
              patientId: this.props.patientId,
            },
          },
        ],
      });
      this.setState({
        error: (response as any).errors ? (response as any).errors[0] : null,
      });
    } catch (err) {
      // TODO: handle errors
    }
  };

  handleOpenEditModal = (patientExternalOrganizationToEdit: FullPatientExternalOrganization) => {
    this.setState({ isEditModalVisible: true, patientExternalOrganizationToEdit });
  };

  handleOpenEditConsentModal = (
    patientExternalOrganizationToEdit: FullPatientExternalOrganization,
  ) => {
    this.setState({ isEditConsentModalVisible: true, patientExternalOrganizationToEdit });
  };

  handleCloseModal = () => {
    this.setState({
      isEditModalVisible: false,
      isEditConsentModalVisible: false,
      patientExternalOrganizationToEdit: null,
    });
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

  renderEditConsentsModal() {
    const { patientId } = this.props;
    const { isEditConsentModalVisible, patientExternalOrganizationToEdit } = this.state;

    if (patientExternalOrganizationToEdit) {
      return (
        <EditPatientExternalOrganizationConsentModal
          isVisible={isEditConsentModalVisible}
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
            onConsentClick={this.handleOpenEditConsentModal}
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
        {this.renderEditConsentsModal()}
      </div>
    );
  }
}

export default graphql(patientExternalOrganizationsGraphql, {
  options: (props: IProps) => ({
    fetchPolicy: 'network-only',
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
