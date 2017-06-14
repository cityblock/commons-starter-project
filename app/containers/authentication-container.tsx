import * as React from 'react';
import { graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import { Header } from '../components/header';
import { getQuery } from '../graphql/helpers';
import { FullUserFragment } from '../graphql/types';

export interface IProps {
  loading: boolean;
  currentUser?: FullUserFragment;
  redirectToLogin: () => any;
  children: any;
}

class Authentication extends React.Component<IProps, {}> {

  async componentWillReceiveProps(newProps: IProps) {
    if (!newProps.loading && this.props.loading && !newProps.currentUser) {
      // TODO: set redirect url to go back ie: dispatch(setRedirectUrl(currentURL))
      await localStorage.removeItem('authToken');
      this.props.redirectToLogin();
    }
  }

  render() {
    if (this.props.currentUser) {
      return (
        <div>
          <Header currentUser={this.props.currentUser} />
          {this.props.children}
        </div>);
    }
    return null;
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>): Partial<IProps> {
  return {
    redirectToLogin: async () => dispatch(push('/')),
  };
}

const currentUserQuery = getQuery('app/graphql/queries/get-current-user.graphql');

const AuthenticationWithGraphQL = graphql(currentUserQuery, {
  props: ({ data }) => ({
    loading: (data ? data.loading : false),
    error: (data ? data.error : null),
    currentUser: (data ? (data as any).currentUser : null),
  }),
})(Authentication as any);

export default connect(undefined, mapDispatchToProps)(AuthenticationWithGraphQL);
