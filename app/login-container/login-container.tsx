import { History } from 'history';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import GoogleLogin from 'react-google-login';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import * as currentUserQuery from '../graphql/queries/get-current-user.graphql';
import * as loginMutation from '../graphql/queries/log-in-user-mutation.graphql';
import { getCurrentUserQuery, logInUserMutationVariables } from '../graphql/types';
import * as styles from './css/login.css';
import Footer from './footer';

interface IProps {
  mutate?: any;
  history: History;
}

interface IGraphqlProps {
  logIn: (options: { variables: logInUserMutationVariables }) => any;
  currentUser?: getCurrentUserQuery['currentUser'];
  loading: boolean;
  error: string | null;
}

interface IGoogleLoginError {
  error: string;
  details: string;
}

type allProps = IGraphqlProps & IProps;

const SCOPE = 'https://www.googleapis.com/auth/calendar';
const HOME_ROUTE = '/dashboard/tasks';
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
      this.props.history.push(HOME_ROUTE);
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

      this.props.history.push(HOME_ROUTE);
      document.title = LOGGED_IN_TITLE;
    } catch (e) {
      await localStorage.removeItem('authToken');
      this.setState({ error: e.message });
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
                  onSuccess={this.onSuccess}
                  onFailure={this.onError}
                  className={styles.button}
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
  graphql<IGraphqlProps, IProps, allProps>(currentUserQuery as any, {
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      currentUser: data ? (data as any).currentUser : null,
    }),
  }),
  graphql<IGraphqlProps, IProps, allProps>(loginMutation as any, { name: 'logIn' }),
)(LoginContainer);
