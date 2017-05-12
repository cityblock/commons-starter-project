import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import { Action } from '../actions';
import { getCurrentUser } from '../actions/user';
import { State as AppState } from '../reducers';

export interface Props {
  authenticated: boolean;
  fetched: boolean;
  getCurrentUser: () => any;
  redirectToLogin: () => any;
}

class Authentication extends React.Component<Props, {}> {

  componentDidMount() {
    this.props.getCurrentUser();
  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.fetched && !newProps.authenticated) {
      // TODO: set redirect url to go back ie: dispatch(setRedirectUrl(currentURL))
      this.props.redirectToLogin();
    }
  }

  render() {
    if (this.props.authenticated) {
      return (
        <div>
          {this.props.children}
        </div>);
    }
    return null;
  }
}

function mapStateToProps(state: AppState) {
  return {
    authenticated: !!state.user.currentUser,
    fetched: state.user.currentUserFetched,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): Partial<Props> {
  return {
    getCurrentUser: () => dispatch(getCurrentUser()),
      redirectToLogin: async () => dispatch(push('/')),
  };
}

const AuthenticationContainer = connect(mapStateToProps, mapDispatchToProps)(Authentication);

export default AuthenticationContainer;
