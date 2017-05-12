import * as React from 'react';
import { User } from '../actions/graphql';

/* tslint:disable:no-var-requires */
const styles: any = require('../css/components/login-scene.css');
/* tslint:enable:no-var-requires */

export interface Props {
  logIn: (email: string, password: string) => any;
  getCurrentUser: () => any;
  onSuccess: () => any;
  currentUser: User;
  isLoading: boolean;
  error?: string;
}

interface State {
  email?: string;
  password?: string;
}

export class LoginScene extends React.Component<Props, State> {

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

  componentDidMount() {
    /**
     * Check if we have current user
     *  if we have a current user, this will redirect to a logged in view
     *  since this component is wrapped in Authenticated component
     */
    this.props.getCurrentUser();
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

  onButtonSubmit() {
    const { email, password } = this.state;
    if (email && password) {
      this.props.logIn(email, password);
    }
  }

  render() {
    const { error } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
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
