import * as classNames from 'classnames';
import { History } from 'history';
import { pickBy } from 'lodash';
import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import * as currentUserQuery from '../graphql/queries/get-current-user.graphql';
import * as usersQuery from '../graphql/queries/get-users.graphql';
import * as userCreateMutationGraphql from '../graphql/queries/user-create-mutation.graphql';
import * as userDeleteMutationGraphql from '../graphql/queries/user-delete-mutation.graphql';
import * as userEditPermissionsMutationGraphql from '../graphql/queries/user-edit-permissions-mutation.graphql';
import * as userEditRoleMutationGraphql from '../graphql/queries/user-edit-role-mutation.graphql';
import {
  getUsersQuery,
  getUsersQueryVariables,
  userCreateMutation,
  userCreateMutationVariables,
  userDeleteMutation,
  userDeleteMutationVariables,
  userEditPermissionsMutation,
  userEditPermissionsMutationVariables,
  userEditRoleMutation,
  userEditRoleMutationVariables,
  FullUserFragment,
  Permissions,
  UserOrderOptions,
  UserRole,
} from '../graphql/types';
import * as sortSearchStyles from '../shared/css/sort-search.css';
import * as styles from '../shared/css/two-panel.css';
import InfiniteScroll from '../shared/infinite-scroll/infinite-scroll';
import Button from '../shared/library/button/button';
import { fetchMore } from '../shared/util/fetch-more';
import UserInvite from './user-invite';
import UserRow from './user-row';

type OrderByOptions =
  | 'createdAtDesc'
  | 'createdAtAsc'
  | 'updatedAtDesc'
  | 'updatedAtAsc'
  | 'lastLoginAtDesc'
  | 'lastLoginAtAsc';

interface IPageParams {
  orderBy: OrderByOptions;
}

interface IProps {
  hasLoggedIn: boolean;
  routeBase: string;
  history: History;
}

interface IState {
  showInviteUser: boolean;
  orderBy: string;
}

export interface IGraphqlProps {
  currentUser?: FullUserFragment;
  loading?: boolean;
  error: string | null;
  deleteUser?: (
    options: { variables: userDeleteMutationVariables },
  ) => { data: userDeleteMutation };
  editUserPermissions?: (
    options: { variables: userEditPermissionsMutationVariables },
  ) => { data: userEditPermissionsMutation };
  editUserRole?: (
    options: { variables: userEditRoleMutationVariables },
  ) => { data: userEditRoleMutation };
  createUser?: (
    options: { variables: userCreateMutationVariables },
  ) => { data: userCreateMutation };
  mutate?: any;
  usersResponse?: getUsersQuery['users'];
  fetchMoreUsers: () => any;
}

export class ManagerUsers extends React.Component<IProps & IGraphqlProps, IState> {
  constructor(props: IProps & IGraphqlProps) {
    super(props);

    const pageParams = getPageParams(props);

    this.state = {
      showInviteUser: false,
      orderBy: (pageParams.orderBy as any) || 'createdAtDesc',
    };
  }

  showInviteUser = () => {
    this.setState({ showInviteUser: true });
  };

  hideInviteUser = () => {
    this.setState({ showInviteUser: false });
  };

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

  onSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as OrderByOptions;
    this.setState({
      orderBy: value,
    });

    const cleanedPageParams = pickBy<IPageParams>({ orderBy: value });
    this.props.history.push({ search: querystring.stringify(cleanedPageParams) });
  };

  renderUser = (user: FullUserFragment) => {
    return (
      <UserRow
        key={user.id}
        user={user}
        deleteUser={this.onDeleteUser}
        editUserPermissions={this.onEditUserPermissions}
        editUserRole={this.onEditUserRole}
      />
    );
  };

  onEditUserPermissions = async (permissions: Permissions, userEmail: string) => {
    const { editUserPermissions } = this.props;

    if (editUserPermissions) {
      await editUserPermissions({ variables: { permissions, email: userEmail } });
    }
  };

  onEditUserRole = async (userRole: UserRole, userEmail: string) => {
    const { editUserRole } = this.props;

    if (editUserRole) {
      await editUserRole({ variables: { userRole, email: userEmail } });
    }
  };

  onDeleteUser = async (userEmail: string) => {
    const { deleteUser } = this.props;

    if (deleteUser) {
      await deleteUser({ variables: { email: userEmail } });
    }
  };

  onInviteUser = async (localPartOfEmail: string) => {
    const { createUser, currentUser } = this.props;

    if (createUser && currentUser) {
      await createUser({
        variables: {
          email: `${localPartOfEmail}@cityblock.com`,
          homeClinicId: currentUser.homeClinicId,
        },
      });
    }
  };

  render() {
    const { usersResponse, hasLoggedIn, loading, error, fetchMoreUsers } = this.props;
    const { orderBy, showInviteUser } = this.state;
    let createButton = null;
    if (!hasLoggedIn) {
      createButton = (
        <div className={styles.createContainer}>
          <Button onClick={this.showInviteUser} messageId="manager.inviteUser" />
        </div>
      );
    }
    const users =
      usersResponse && usersResponse.edges ? usersResponse.edges.map((edge: any) => edge.node) : [];
    const hasNextPage =
      usersResponse && usersResponse.pageInfo ? usersResponse.pageInfo.hasNextPage : false;
    const usersStyles = classNames(styles.itemsList, {
      [styles.compressed]: showInviteUser,
    });
    const inviteUserHtml = showInviteUser ? (
      <UserInvite onClose={this.hideInviteUser} inviteUser={this.onInviteUser} />
    ) : null;

    return (
      <div className={styles.container}>
        <div className={styles.sortSearchBar}>
          <div className={sortSearchStyles.sort}>
            <div className={sortSearchStyles.sortLabel}>Sort by:</div>
            <div className={sortSearchStyles.sortDropdown}>
              <select value={orderBy} onChange={this.onSortChange}>
                <option value="createdAtDesc">Newest first</option>
                <option value="createdAtAsc">Oldest first</option>
                <option value="lastLoginAtDesc">Logged in descending</option>
                <option value="lastLoginAtAsc">Logged in ascending</option>
                <option value="updatedAtDesc">Last updated</option>
                <option value="updatedAtAsc">Last updated desc</option>
              </select>
            </div>
          </div>
          {createButton}
        </div>
        <div className={styles.bottomContainer}>
          <InfiniteScroll
            loading={loading}
            error={error}
            fetchMore={fetchMoreUsers}
            hasNextPage={hasNextPage}
            isEmpty={users ? users.length > 0 : true}
            compressed={showInviteUser}
          >
            {this.renderUsers(users || [])}
          </InfiniteScroll>
          <div className={usersStyles}>{inviteUserHtml}</div>
        </div>
      </div>
    );
  }
}

const getPageParams = (props: IProps): getUsersQueryVariables => {
  const pageParams = querystring.parse(window.location.search.substring(1));
  return {
    pageNumber: 0,
    pageSize: 10,
    orderBy: (pageParams.orderBy || 'createdAtDesc') as UserOrderOptions,
    hasLoggedIn: props.hasLoggedIn,
  };
};

export default compose(
  withRouter,
  graphql<IGraphqlProps, IProps>(userDeleteMutationGraphql as any, {
    name: 'deleteUser',
    options: {
      refetchQueries: ['getUsers'],
    },
  }),
  graphql<IGraphqlProps, IProps>(userEditPermissionsMutationGraphql as any, {
    name: 'editUserPermissions',
  }),

  graphql<IGraphqlProps, IProps>(userEditRoleMutationGraphql as any, {
    name: 'editUserRole',
  }),
  graphql<IGraphqlProps, IProps>(userCreateMutationGraphql as any, {
    name: 'createUser',
    options: {
      refetchQueries: ['getUsers'],
    },
  }),
  graphql<IGraphqlProps, IProps>(currentUserQuery as any, {
    props: ({ data }) => ({
      currentUser: data ? (data as any).currentUser : null,
    }),
  }),
  graphql<IGraphqlProps, IProps>(usersQuery as any, {
    options: (props: IProps) => ({ variables: getPageParams(props) }),
    props: ({ data, ownProps }) => ({
      fetchMoreUsers: () =>
        fetchMore<FullUserFragment>(data as any, getPageParams(ownProps), 'users'),
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      usersResponse: data ? (data as any).users : null,
    }),
  }),
)(ManagerUsers);
