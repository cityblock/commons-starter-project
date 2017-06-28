import * as React from 'react';
import { graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import { Header } from '../components/header';
import * as styles from '../css/main.css';
import * as currentUserQuery from '../graphql/queries/get-current-user.graphql';
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
          <div className={styles.app}>
            {this.props.children}
          </div>
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

const AuthenticationWithGraphQL = graphql(currentUserQuery as any, {
  props: ({ data }) => ({
    loading: (data ? data.loading : false),
    error: (data ? data.error : null),
    currentUser: (data ? (data as any).currentUser : null),
  }),
})(Authentication as any);

export default connect(undefined, mapDispatchToProps)(AuthenticationWithGraphQL);
