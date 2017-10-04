import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as userCreateMutation from '../graphql/queries/user-create-mutation.graphql';
import * as userDeleteMutation from '../graphql/queries/user-delete-mutation.graphql';
import * as userEditRoleMutation from '../graphql/queries/user-edit-role-mutation.graphql';
import * as usersQuery from '../graphql/queries/users-get.graphql';
import {
  getUsersQuery,
  userCreateMutationVariables,
  userDeleteMutationVariables,
  userEditRoleMutationVariables,
  FullUserFragment,
} from '../graphql/types';
import * as sortSearchStyles from '../shared/css/sort-search.css';
import * as styles from '../shared/css/two-panel.css';
import { fetchMoreUsers } from '../shared/util/fetch-more-users';
import { UserRow } from './user-row';

export type OrderByOptions =
  | 'createdAtDesc'
  | 'createdAtAsc'
  | 'updatedAtDesc'
  | 'updatedAtAsc'
  | 'lastLoginAtDesc'
  | 'lastLoginAtAsc';

export interface IPageParams {
  orderBy: OrderByOptions;
}

export interface IProps {
  hasLoggedIn: boolean;
  routeBase: string;
  loading?: boolean;
  error?: string;
  deleteUser?: (
    options: { variables: userDeleteMutationVariables },
  ) => { data: { userDelete: FullUserFragment } };
  editUserRole?: (
    options: { variables: userEditRoleMutationVariables },
  ) => { data: { userEdit: FullUserFragment } };
  createUser?: (
    options: { variables: userCreateMutationVariables },
  ) => { data: { userDelete: FullUserFragment } };
  mutate?: any;
  usersResponse?: getUsersQuery['users'];
  fetchMoreUsers: () => any;
  updatePageParams: (pageParams: IPageParams) => any;
  refetchUsers: () => any;
}

export class ManagerUsers extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);

    this.renderUsers = this.renderUsers.bind(this);
    this.renderUser = this.renderUser.bind(this);
    this.onDeleteUser = this.onDeleteUser.bind(this);
  }

  renderUsers(users: FullUserFragment[]) {
    const { loading, error } = this.props;

    if (users.length > 0) {
      return users.map(this.renderUser);
    } else if (!loading && !error) {
      return (
        <div className={styles.emptyMessage}>
          <div className={styles.emptyLogo} />
          <div className={styles.emptyLabel}>No Users</div>
        </div>
      );
    }
  }

  renderUser(user: FullUserFragment) {
    return (
      <UserRow
        key={user.id}
        user={user}
        deleteUser={this.onDeleteUser}
        editUserRole={this.props.editUserRole}
      />
    );
  }

  async onDeleteUser(userEmail: string) {
    const { deleteUser } = this.props;

    if (deleteUser) {
      await deleteUser({ variables: { email: userEmail } });
    }

    this.props.refetchUsers();
  }

  getSearchBarContent(showCreateButton: boolean) {
    if (showCreateButton) {
      return (
        <div className={styles.createContainer}>
          <div className={styles.createButton}>
            Create User
          </div>
        </div>
      );
    }
    return (
      <div className={sortSearchStyles.sort}>
        <div className={sortSearchStyles.sortLabel}>Sort by:</div>
        <div className={sortSearchStyles.sortDropdown}>
          <select value='Newest first'>
            <option value='createdAtDesc'>Newest first</option>
            <option value='createdAtAsc'>Oldest first</option>
            <option value='lastLoginAtDesc'>Logged in descending</option>
            <option value='lastLoginAtAsc'>Logged in ascending</option>
            <option value='updatedAtDesc'>Last updated</option>
            <option value='updatedAtAsc'>Last updated desc</option>
          </select>
        </div>
      </div>
    );
  }

  render() {
    const { usersResponse, hasLoggedIn } = this.props;
    const users =
      usersResponse && usersResponse.edges ? usersResponse.edges.map((edge: any) => edge.node) : [];
    return (
      <div className={styles.container}>
        <div className={styles.sortSearchBar}>{this.getSearchBarContent(hasLoggedIn)}</div>
        <div className={styles.bottomContainer}>
          <div className={styles.itemsList}>{this.renderUsers(users || [])}</div>
        </div>
      </div>
    );
  }
}

const getPageParams = (props: IProps) => {
  const pageParams = querystring.parse(window.location.search.substring(1));
  return {
    pageNumber: 0,
    pageSize: 10,
    orderBy: pageParams.orderBy || 'createdAtDesc',
    hasLoggedIn: props.hasLoggedIn,
  };
};

export default (compose as any)(
  graphql(userDeleteMutation as any, { name: 'deleteUser' }),
  graphql(userEditRoleMutation as any, { name: 'editUserRole' }),
  graphql(userCreateMutation as any, { name: 'createUser' }),
  graphql(usersQuery as any, {
    options: (props: IProps) => ({ variables: getPageParams(props) }),
    props: ({ data, ownProps }) => ({
      fetchMoreUsers: () => fetchMoreUsers(data as any, getPageParams(ownProps), 'users'),
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      usersResponse: data ? (data as any).users : null,
    }),
  }),
)(ManagerUsers);
