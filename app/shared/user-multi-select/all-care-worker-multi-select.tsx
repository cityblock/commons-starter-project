import { ApolloError } from 'apollo-client';
import { pull } from 'lodash';
import React from 'react';
import { graphql } from 'react-apollo';
import userSummaryListGraphql from '../../graphql/queries/get-user-summary-list.graphql';
import { getUserSummaryList, UserRole } from '../../graphql/types';
import { getUserInfo } from './get-info-helpers';
import UserMultiSelect, { IUser } from './user-multi-select';

interface IProps {
  onChange: (users: IUser[], name?: string) => void;
  selectedUsers: IUser[];
  placeholderMessageId: string;
  name?: string;
}

interface IGraphqlProps {
  userSummaryList: getUserSummaryList['userSummaryList'];
  isLoading: boolean;
  error: ApolloError | null | undefined;
}

type allProps = IProps & IGraphqlProps;

export const AllCareWorkerMultiSelect: React.StatelessComponent<allProps> = props => {
  const {
    isLoading,
    error,
    userSummaryList,
    placeholderMessageId,
    onChange,
    selectedUsers,
    name,
  } = props;
  const formattedCareTeam = userSummaryList
    ? userSummaryList.map(user => getUserInfo(user, false))
    : [];

  return (
    <UserMultiSelect
      onChange={onChange}
      selectedUsers={selectedUsers}
      users={formattedCareTeam}
      placeholderMessageId={placeholderMessageId}
      name={name}
      isLoading={isLoading}
      error={error ? error.message : undefined}
    />
  );
};

export default graphql(userSummaryListGraphql, {
  options: (props: IProps) => ({
    variables: {
      userRoleFilters: pull(Object.keys(UserRole), 'Back_Office_Admin'),
    },
    fetchPolicy: 'network-only',
  }),
  props: ({ data }): IGraphqlProps => ({
    isLoading: data ? data.loading : false,
    error: data ? data.error : null,
    userSummaryList: data ? (data as any).userSummaryList : null,
  }),
})(AllCareWorkerMultiSelect);
