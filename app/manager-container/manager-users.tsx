import * as classNames from 'classnames';
import { pickBy } from 'lodash';
import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import * as usersQuery from '../graphql/queries/get-users.graphql';
import * as userCreateMutationGraphql from '../graphql/queries/user-create-mutation.graphql';
import * as userDeleteMutationGraphql from '../graphql/queries/user-delete-mutation.graphql';
import * as userEditRoleMutationGraphql from '../graphql/queries/user-edit-role-mutation.graphql';
import {
  getUsersQuery,
  getUsersQueryVariables,
  userCreateMutation,
  userCreateMutationVariables,
  userDeleteMutation,
  userDeleteMutationVariables,
  userEditRoleMutation,
  userEditRoleMutationVariables,
  FullUserFragment,
} from '../graphql/types';
import * as sortSearchStyles from '../shared/css/sort-search.css';
import * as styles from '../shared/css/two-panel.css';
import InfiniteScroll from '../shared/infinite-scroll/infinite-scroll';
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

interface IDispatchProps {
  updatePageParams: (pageParams: IPageParams) => any;
  redirectToUsers: () => any;
}

interface IProps {
  hasLoggedIn: boolean;
  routeBase: string;
}

interface IState {
  showInviteUser: false;
  orderBy: string;
}

export interface IGraphqlProps {
  loading?: boolean;
  error?: string;
  deleteUser?: (
    options: { variables: userDeleteMutationVariables },
  ) => { data: userDeleteMutation };
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

export class ManagerUsers extends React.Component<IProps & IDispatchProps & IGraphqlProps, IState> {
  constructor(props: IProps & IDispatchProps & IGraphqlProps) {
    super(props);

    this.renderUsers = this.renderUsers.bind(this);
    this.renderUser = this.renderUser.bind(this);
    this.onDeleteUser = this.onDeleteUser.bind(this);
    this.onEditUserRole = this.onEditUserRole.bind(this);
    this.showInviteUser = this.showInviteUser.bind(this);
    this.hideInviteUser = this.hideInviteUser.bind(this);
    this.onInviteUser = this.onInviteUser.bind(this);
    this.onSortChange = this.onSortChange.bind(this);

    const pageParams = getPageParams(props);

    this.state = {
      showInviteUser: false,
      orderBy: (pageParams.orderBy as any) || 'createdAtDesc',
    };
  }

  showInviteUser() {
    this.setState(() => ({ showInviteUser: true }));
  }

  hideInviteUser() {
    this.setState(() => ({ showInviteUser: false }));
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

  onSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value as OrderByOptions;
    this.setState({
      orderBy: value,
    });
    this.props.updatePageParams({ orderBy: value });
  }

  renderUser(user: FullUserFragment) {
    return (
      <UserRow
        key={user.id}
        user={user}
        deleteUser={this.onDeleteUser}
        editUserRole={this.onEditUserRole}
      />
    );
  }

  async onEditUserRole(userRole: string, userEmail: string) {
    const { editUserRole } = this.props;

    if (editUserRole) {
      await editUserRole({ variables: { userRole, email: userEmail } });
    }
  }

  async onDeleteUser(userEmail: string) {
    const { deleteUser } = this.props;

    if (deleteUser) {
      await deleteUser({ variables: { email: userEmail } });
    }
  }

  async onInviteUser(localPartOfEmail: string) {
    const { createUser } = this.props;

    if (createUser) {
      await createUser({
        variables: {
          email: `${localPartOfEmail}@cityblock.com`,
          homeClinicId: '1', // TODO
        },
      });
    }
  }

  render() {
    const { usersResponse, hasLoggedIn, loading, error, fetchMoreUsers } = this.props;
    const { orderBy, showInviteUser } = this.state;
    let createButton = null;
    if (!hasLoggedIn) {
      createButton = (
        <div className={styles.createContainer}>
          <div onClick={this.showInviteUser} className={styles.createButton}>
            Invite User
          </div>
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
                <option value='createdAtDesc'>Newest first</option>
                <option value='createdAtAsc'>Oldest first</option>
                <option value='lastLoginAtDesc'>Logged in descending</option>
                <option value='lastLoginAtAsc'>Logged in ascending</option>
                <option value='updatedAtDesc'>Last updated</option>
                <option value='updatedAtAsc'>Last updated desc</option>
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
    orderBy: pageParams.orderBy || 'createdAtDesc',
    hasLoggedIn: props.hasLoggedIn,
  };
};

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: IProps): IDispatchProps {
  return {
    redirectToUsers: () => {
      const { routeBase } = ownProps;
      dispatch(push(routeBase));
    },
    updatePageParams: (pageParams: IPageParams) => {
      const cleanedPageParams = pickBy<IPageParams, {}>(pageParams);
      dispatch(push({ search: querystring.stringify(cleanedPageParams) }));
    },
  };
}

export default compose(
  connect<{}, IDispatchProps, IProps>(undefined, mapDispatchToProps),
  graphql(userDeleteMutationGraphql as any, {
    name: 'deleteUser',
    options: {
      refetchQueries: ['getUsers'],
    },
  }),
  graphql(userEditRoleMutationGraphql as any, { name: 'editUserRole' }),
  graphql(userCreateMutationGraphql as any, {
    name: 'createUser',
    options: {
      refetchQueries: ['getUsers'],
    },
  }),
  graphql(usersQuery as any, {
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
