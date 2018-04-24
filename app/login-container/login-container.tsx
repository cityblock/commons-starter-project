import { History } from 'history';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { isMobile } from 'react-device-detect';
import GoogleLogin from 'react-google-login';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { getHomeRoute } from '../authentication-container/helpers';
import * as loginMutation from '../graphql/queries/log-in-user-mutation.graphql';
import { logInUserMutationVariables } from '../graphql/types';
import withCurrentUser, { IInjectedProps } from '../shared/with-current-user/with-current-user';
import * as styles from './css/login.css';
import Footer from './footer';

interface IProps extends IInjectedProps {
  mutate?: any;
  history: History;
}

interface IGraphqlProps {
  logIn: (options: { variables: logInUserMutationVariables }) => any;
  loading: boolean;
  error: string | null;
}

interface IGoogleLoginError {
  error: string;
  details: string;
}

type allProps = IGraphqlProps & IProps;

const SCOPE = 'https://www.googleapis.com/auth/calendar';
const DESKTOP_HOME_ROUTE = '/dashboard/tasks';
const MOBILE_HOME_ROUTE = '/contacts';
const LOGGED_IN_TITLE = 'Commons | A Cityblock Health product';

export class LoginContainer extends React.Component<allProps, { error: string | null }> {
  constructor(props: allProps) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.state = {
      error: null,
    };
  }

  componentWillReceiveProps(newProps: allProps) {
    if (newProps.currentUser) {
      // Log in succeeded. Navigate to the patients list scene.
      this.props.history.push(getHomeRoute(newProps.featureFlags));
      document.title = LOGGED_IN_TITLE;
    }
  }

  componentDidMount() {
    document.title = 'Log in | Commons';
  }

  async onSuccess(response: any) {
    try {
      const res = await this.props.logIn({ variables: { googleAuthCode: response.code } });
      await localStorage.setItem('authToken', res.data.userLogin.authToken);

      const redirectRoute = isMobile ? MOBILE_HOME_ROUTE : DESKTOP_HOME_ROUTE;
      this.props.history.push(redirectRoute);
      document.title = LOGGED_IN_TITLE;
    } catch (err) {
      await localStorage.removeItem('authToken');
      this.setState({ error: err.message });
    }
  }

  async onError(error: IGoogleLoginError) {
    this.setState({ error: error.details });
  }

  render() {
    const { error } = this.state;
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

export default compose(
  withRouter,
  withCurrentUser(),
  graphql(loginMutation as any, { name: 'logIn' }),
)(LoginContainer) as React.ComponentClass<IProps>;
