import React from 'react';
import { compose, graphql } from 'react-apollo';
import patientExternalProvidersGraphql from '../../../graphql/queries/get-patient-external-providers.graphql';
import patientExternalProviderDeleteGraphql from '../../../graphql/queries/patient-external-provider-delete-mutation.graphql';
import {
  getPatientExternalProviders,
  patientExternalProviderDelete,
  patientExternalProviderDeleteVariables,
  FullPatientExternalProvider,
} from '../../../graphql/types';
import EmptyPlaceholder from '../../../shared/library/empty-placeholder/empty-placeholder';
import styles from '../css/patient-team.css';
import EditPatientExternalProviderModal from './edit-patient-external-provider-modal';
import PatientExternalProvider from './patient-external-provider';

interface IProps {
  patientId: string;
}

interface IGraphqlProps {
  patientExternalProviders?: getPatientExternalProviders['patientExternalProviders'];
  patientExternalProviderDelete: (
    options: { variables: patientExternalProviderDeleteVariables },
  ) => { data: patientExternalProviderDelete };
  isLoading?: boolean;
  error?: string | null;
}

export type allProps = IGraphqlProps & IProps;

interface IState {
  isEditModalVisible: boolean;
  patientExternalProviderToEdit?: FullPatientExternalProvider | null;
}

export class PatientExternalTeam extends React.Component<allProps, IState> {
  state = { isEditModalVisible: false, patientExternalProviderToEdit: undefined };

  handleRemove = async (patientExternalProviderId: string) => {
    try {
      await this.props.patientExternalProviderDelete({ variables: { patientExternalProviderId } });
    } catch (err) {
      // TODO: handle errors
    }
  };

  handleOpenEditModal = (patientExternalProviderToEdit: FullPatientExternalProvider) => {
    this.setState({ isEditModalVisible: true, patientExternalProviderToEdit });
  };

  handleCloseModal = () => {
    this.setState({ isEditModalVisible: false, patientExternalProviderToEdit: null });
  };

  renderEditModal() {
    const { patientId } = this.props;
    const { isEditModalVisible, patientExternalProviderToEdit } = this.state;

    if (patientExternalProviderToEdit) {
      return (
        <EditPatientExternalProviderModal
          isVisible={isEditModalVisible}
          closePopup={this.handleCloseModal}
          patientExternalProvider={patientExternalProviderToEdit}
          patientId={patientId}
        />
      );
    }

    return null;
  }

  renderTeamMembers() {
    const { isLoading } = this.props;
    const patientExternalProviders = this.props.patientExternalProviders || [];

    if (isLoading) {
      return null;
    }

    if (!patientExternalProviders.length) {
      return (
        <EmptyPlaceholder
          headerMessageId="patientTeam.externalTeamEmptyTitle"
          detailMessageId="patientTeam.externalTeamEmptyDetail"
          icon="inbox"
        />
      );
    }

    return patientExternalProviders.map(patientExternalProvider => (
      <PatientExternalProvider
        key={patientExternalProvider.id}
        patientExternalProvider={patientExternalProvider}
        onRemoveClick={this.handleRemove}
        onEditClick={this.handleOpenEditModal}
      />
    ));
  }

  render(): JSX.Element {
    return (
      <div className={styles.container}>
        {this.renderTeamMembers()}
        {this.renderEditModal()}
      </div>
    );
  }
}

export default compose(
  graphql(patientExternalProviderDeleteGraphql, {
    name: 'patientExternalProviderDelete',
    options: (props: IProps) => ({
      refetchQueries: [
        {
          query: patientExternalProvidersGraphql,
          variables: {
            patientId: props.patientId,
          },
        },
      ],
    }),
  }),
  graphql(patientExternalProvidersGraphql, {
    options: (props: IProps) => ({
      fetchPolicy: 'network-only',
      variables: {
        patientId: props.patientId,
      },
    }),
    props: ({ data }) => ({
      isLoading: data ? data.loading : false,
      error: data ? data.error : null,
      patientExternalProviders: data ? (data as any).patientExternalProviders : null,
    }),
  }),
)(PatientExternalTeam) as React.ComponentClass<IProps>;
