import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import GoogleLogin, { GoogleLoginResponseOffline } from 'react-google-login';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import Footer from '../components/footer';
import * as styles from '../css/components/login-scene.css';
import * as currentUserQuery from '../graphql/queries/get-current-user.graphql';
import * as loginMutation from '../graphql/queries/log-in-user-mutation.graphql';
import { FullUserFragment, LogInUserMutationVariables } from '../graphql/types';

export interface IProps {
  logIn: (options: { variables: LogInUserMutationVariables }) => any;
  onSuccess: () => any;
  currentUser?: FullUserFragment;
  loading: boolean;
  error?: string;
}

interface IGoogleLoginError {
  error: string;
  details: string;
}

const SCOPE = 'https://www.googleapis.com/auth/calendar';

class LoginContainer extends React.Component<IProps, { error?: string }> {

  constructor(props: IProps) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.state = {
      error: undefined,
    };
  }

  componentWillReceiveProps(newProps: IProps) {
    if (newProps.currentUser) {
      // Log in succeeded. Navigate to the patients list scene.
      this.props.onSuccess();
    }
  }

  componentDidMount() {
    document.title = 'Log in | Commons';
  }

  async onSuccess(response: GoogleLoginResponseOffline) {
    try {
      const res = await this.props.logIn({ variables: { googleAuthCode: response.code } });
      await localStorage.setItem('authToken', res.data.userLogin.authToken);
      this.props.onSuccess();
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
        </div>);
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
                  buttonText='Login'
                  offline
                  scope={SCOPE}
                  onSuccess={this.onSuccess}
                  onFailure={this.onError}
                  className={styles.button}>
                  <span className={styles.googleIcon} />
                  <span className={styles.buttonText}>Sign in with Google</span>
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

function mapDispatchToProps(dispatch: Dispatch<() => void>): Partial<IProps> {
  return {
    onSuccess: async () => dispatch(push('/patients')),
  };
}

export default (compose as any)(
  connect(undefined, mapDispatchToProps),
  graphql(currentUserQuery as any, {
    props: ({ data }) => ({
      loading: (data ? data.loading : false),
      error: (data ? data.error : null),
      currentUser: (data ? (data as any).currentUser : null),
    }),
  }),
  graphql(loginMutation as any, { name: 'logIn' }),
)(LoginContainer);
