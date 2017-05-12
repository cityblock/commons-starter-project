import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import { Action } from '../actions';
import { getCurrentUser, logInUser } from '../actions/user';
import { State } from '../reducers';
import { LoginScene, Props } from '../scenes/login-scene';

function mapStateToProps(state: State): Partial<Props> {
  return {
    isLoading: state.user.isLoginLoading,
    error: state.user.error,
    currentUser: state.user.currentUser,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): Partial<Props> {
  return {
    getCurrentUser: () => dispatch(getCurrentUser()),
    logIn: (email: string, password: string) => {
      dispatch(logInUser({ email, password }));
    },
    onSuccess: async () => dispatch(push('/')), // TODO: change later
  };
}

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(LoginScene);

export default LoginContainer;
