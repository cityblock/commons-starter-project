import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import * as styles from '../css/components/login-scene.css';
import { getQuery } from '../graphql/helpers';
import { FullUserFragment, LogInUserMutationVariables } from '../graphql/types';

export interface Props {
  logIn: (options: { variables: LogInUserMutationVariables }) => any;
  onSuccess: () => any;
  currentUser?: FullUserFragment;
  loading: boolean;
  error?: string;
}

interface State {
  email?: string;
  password?: string;
}

export class LoginContainer extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onButtonSubmit = this.onButtonSubmit.bind(this);
    this.state = {
      email: '',
      password: '',
    };
  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.currentUser) {
      // Log in succeeded. Navigate to the patients list scene.
      this.props.onSuccess();
    }
  }

  onChangeEmail(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ email: event.target.value });
  }

  onChangePassword(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: event.target.value });
  }

  async onButtonSubmit() {
    const { email, password } = this.state;
    if (email && password) {
      // TODO: loading state
      try {
        const response = await this.props.logIn({ variables: { email, password } });
        const token = response.data.login.authToken;
        await localStorage.setItem('authToken', token);
        this.props.onSuccess();
      } catch (error) {
        await localStorage.removeItem('authToken');
      }
    }
    return false;
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.title}>Log In</div>
          <div className={styles.inputContainer}>
            <input
              type='text'
              placeholder='Your Email'
              className={styles.input}
              value={this.state.email}
              onChange={this.onChangeEmail}
            />
          </div>
          <div className={styles.inputContainer}>
            <input
              type='password'
              placeholder='Password'
              value={this.state.password}
              className={styles.input}
              onChange={this.onChangePassword}
            />
          </div>
          <button className={styles.button} onClick={this.onButtonSubmit}>
            Log In
          </button>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>): Partial<Props> {
  return {
    onSuccess: async () => dispatch(push('/patients')),
  };
}

const currentUserQuery = getQuery('app/graphql/queries/get-current-user.graphql');
const loginMutation = getQuery('app/graphql/queries/log-in-user-mutation.graphql');

export default compose(
  connect(undefined, mapDispatchToProps),
  graphql(currentUserQuery, {
    props: ({ data: { loading, error, currentUser } }) => ({
      loading,
      error,
      currentUser,
    }),
  }),
  graphql(loginMutation, { name: 'logIn' }),
)(LoginContainer);
