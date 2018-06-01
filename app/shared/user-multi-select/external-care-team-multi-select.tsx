import { ApolloError } from 'apollo-client';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as familyQuery from '../../graphql/queries/get-patient-contacts.graphql';
import * as externalProvidersQuery from '../../graphql/queries/get-patient-external-providers.graphql';
import {
  FullPatientContactFragment,
  FullPatientExternalProviderFragment,
} from '../../graphql/types';
import { getFamilyMemberInfo, getProviderInfo } from './get-info-helpers';
import UserMultiSelect, { IUser } from './user-multi-select';

export interface IProps {
  patientId: string;
  onChange: (users: IUser[], name?: string) => void;
  selectedUsers: IUser[];
  placeholderMessageId: string;
  name?: string;
}

interface IGraphqlProps {
  isExternalProvidersLoading?: boolean;
  externalProvidersError?: ApolloError | null | undefined;
  externalProviders?: FullPatientExternalProviderFragment[];
  isFamilyLoading?: boolean;
  familyError?: ApolloError | null | undefined;
  family?: FullPatientContactFragment[];
}

export type allProps = IProps & IGraphqlProps;

export const ExternalCareTeamMultiSelect = (props: allProps) => {
  const {
    isExternalProvidersLoading,
    isFamilyLoading,
    externalProvidersError,
    familyError,
    family,
    externalProviders,
    placeholderMessageId,
    onChange,
    selectedUsers,
    name,
  } = props;

  const formattedProviders: IUser[] = (externalProviders || []).map(getProviderInfo);
  const formattedFamily: IUser[] = (family || []).map(getFamilyMemberInfo);

  const error = externalProvidersError || familyError;

  return (
    <UserMultiSelect
      onChange={onChange}
      selectedUsers={selectedUsers}
      users={formattedProviders.concat(formattedFamily)}
      placeholderMessageId={placeholderMessageId}
      name={name}
      isLoading={isExternalProvidersLoading || isFamilyLoading}
      error={error ? error.message : undefined}
    />
  );
};

export default compose(
  graphql(externalProvidersQuery as any, {
    options: (ownProps: IProps) => ({
      variables: {
        patientId: ownProps.patientId,
      },
    }),
    props: ({ data }) => ({
      isExternalProvidersLoading: data ? data.loading : false,
      externalProvidersError: data ? data.error : null,
      externalProviders: data ? (data as any).patientExternalProviders : null,
    }),
  }),
  graphql(familyQuery as any, {
    options: (ownProps: IProps) => ({
      variables: {
        patientId: ownProps.patientId,
      },
    }),
    props: ({ data }) => ({
      isFamilyLoading: data ? data.loading : false,
      familyError: data ? data.error : null,
      family: data ? (data as any).patientContacts : null,
    }),
  }),
)(ExternalCareTeamMultiSelect) as React.ComponentClass<IProps>;
