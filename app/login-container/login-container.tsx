import { ApolloError } from 'apollo-client';
import { History } from 'history';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import GoogleLogin from 'react-google-login';
import { FormattedMessage } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { setCurrentUser } from '../actions/current-user-action';
import currentUserGraphql from '../graphql/queries/get-current-user.graphql';
import login from '../graphql/queries/log-in-user-mutation.graphql';
import { logInUser, logInUserVariables } from '../graphql/types';
import { getCurrentUser } from '../graphql/types';
import { IState as IAppState } from '../store';
import styles from './css/login.css';
import Footer from './footer';

interface IProps {
  mutate?: any;
  history: History;
  location: {
    state?: {
      from: string;
    };
  };
}

interface IGraphqlProps {
  logIn: (
    options: { variables: logInUserVariables },
  ) => { data: logInUser; errors: ApolloError[] | null };
  error: ApolloError | null | undefined;
  loading: boolean;
  currentUser?: getCurrentUser['currentUser'];
  refetchCurrentUser: () => Promise<{ data: getCurrentUser }>;
}

interface IStateProps {
  isAuthenticated: boolean;
}

interface IDispatchProps {
  setCurrentUser: (currentUser: getCurrentUser['currentUser']) => void;
}

interface IGoogleLoginError {
  error: string;
  details: string;
}

type allProps = IGraphqlProps & IStateProps & IDispatchProps & IProps;

const SCOPE = 'https://www.googleapis.com/auth/calendar';

export class LoginContainer extends React.Component<allProps, { error: string | null }> {
  state = {
    error: null,
  };

  onSuccess = async (response: any) => {
    try {
      const res = await this.props.logIn({ variables: { googleAuthCode: response.code } });
      if (res.errors) {
        await localStorage.removeItem('authToken');
        return this.setState({ error: res.errors[0].message });
      } else if (res.data && res.data.userLogin && res.data.userLogin.authToken) {
        await localStorage.setItem('authToken', res.data.userLogin.authToken);
        const result = await this.props.refetchCurrentUser();
        this.props.setCurrentUser(result.data.currentUser);
      } else {
        await localStorage.removeItem('authToken');
        return this.setState({ error: 'Unknown login error' });
      }
    } catch (err) {
      await localStorage.removeItem('authToken');
      this.setState({ error: err.message });
    }
  };

  onError = (error: IGoogleLoginError) => {
    this.setState({ error: error.details });
  };

  render() {
    const { error } = this.state;
    const { isAuthenticated } = this.props;

    if (isAuthenticated) {
      const to =
        this.props.location.state && this.props.location.state.from !== '/'
          ? this.props.location.state.from
          : '/dashboard/tasks';
      return (
        <Redirect
          to={{
            pathname: to,
          }}
        />
      );
    }

    let errorHtml = null;
    if (error) {
      errorHtml = (
        <div className={styles.error}>
          <div className={styles.errorIcon} />
          <div className={styles.errorText}>{error}</div>
        </div>
      );
    }
    const clientId = process.env.GOOGLE_OAUTH_TOKEN || 'fake-token';
    return (
      <div>
        <div className={styles.background}>
          <div className={styles.container}>
            <div className={styles.formErrorContainer}>
              <div className={styles.form}>
                <div className={styles.title}>Commons</div>
                <GoogleLogin
                  clientId={clientId}
                  buttonText="Login"
                  scope={SCOPE}
                  responseType="code"
                  prompt="select_account"
                  onSuccess={this.onSuccess}
                  onFailure={this.onError}
                  className={styles.button}
                  accessType="offline"
                >
                  <span className={styles.googleIcon} />
                  <FormattedMessage id="login.logInGoogle">
                    {(message: string) => <span className={styles.buttonText}>{message}</span>}
                  </FormattedMessage>
                </GoogleLogin>
              </div>
              {errorHtml}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: any): IStateProps {
  return {
    isAuthenticated: state.currentUser.isAuthenticated,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): IDispatchProps {
  return {
    setCurrentUser: (currentUser: getCurrentUser['currentUser']) =>
      dispatch(setCurrentUser(currentUser)),
  };
}

export default compose(
  withRouter,
  connect<IStateProps, IDispatchProps, allProps>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps as any,
  ),
  graphql(currentUserGraphql, {
    props: ({ data }): Partial<IGraphqlProps> => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      currentUser: data ? (data as any).currentUser : null,
      refetchCurrentUser: data ? (data as any).refetch : null,
    }),
  }),
  graphql(login, { name: 'logIn' }),
)(LoginContainer) as React.ComponentClass<IProps>;
