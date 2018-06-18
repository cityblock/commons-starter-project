import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import userSummaryListQuery from '../../graphql/queries/get-user-summary-list.graphql';
import { getUserSummaryListQuery } from '../../graphql/types';
import { getUserInfo } from './get-info-helpers';
import UserMultiSelect, { IUser } from './user-multi-select';

interface IProps {
  onChange: (users: IUser[], name?: string) => void;
  selectedUsers: IUser[];
  placeholderMessageId: string;
  name?: string;
}

interface IGraphqlProps {
  userSummaryList: getUserSummaryListQuery['userSummaryList'];
  isLoading: boolean;
  error: ApolloError | null | undefined;
}

type allProps = IProps & IGraphqlProps;

const CARE_WORKER_ROLES = [
  'physician',
  'nurseCareManager',
  'healthCoach',
  'communityHealthPartner',
];

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

export default graphql(userSummaryListQuery, {
  options: (props: IProps) => ({
    variables: {
      userRoleFilters: CARE_WORKER_ROLES,
    },
  }),
  props: ({ data }): IGraphqlProps => ({
    isLoading: data ? data.loading : false,
    error: data ? data.error : null,
    userSummaryList: data ? (data as any).userSummaryList : null,
  }),
})(AllCareWorkerMultiSelect);
