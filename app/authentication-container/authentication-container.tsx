import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { setCurrentUser } from '../actions/current-user-action';
import { idleEnd, idleStart } from '../actions/idle-action';
import { selectLocale } from '../actions/locale-action';
import * as currentUserQuery from '../graphql/queries/get-current-user.graphql';
import { getCurrentUserQuery } from '../graphql/types';
import ProgressNoteContainer from '../progress-note-container/progress-note-container';
import { Lang } from '../reducers/locale-reducer';
import { IState as IAppState } from '../store';
import * as styles from './css/auth.css';
import Header from './header';
import { IdlePopup } from './idle-popup';

interface IStateProps {
  isIdle: boolean;
}

type CurrentUser = getCurrentUserQuery['currentUser'];

export interface IDispatchProps {
  idleStart: () => void;
  idleEnd: () => void;
  selectLocale: (locale: Lang) => void;
  setCurrentUser: (currentUser: CurrentUser) => void;
}

interface IProps {
  error?: string | null;
  loading?: boolean;
  currentUser?: CurrentUser;
  children: any;
  data?: any;
}

const IDLE_TIME = 1000000; // 18 minutes

type allProps = IProps & IStateProps & IDispatchProps;

/**
 * Logs user out if idle
 *
 * Idle popup is displayed if no action taken since IDLE_TIME
 * Logout if no action taken since idle popup displayed + IDLE_TIME
 *
 * Both the Redux Store and Apollo middleware update a local storage value for the user's lastAction
 * Every second, this component reads lastAction and checks the gap between the current time and the last action
 * If gap is more than IDLE_TIME, this component dispatches a redux action to set isIdle to true
 * NOTE: Updating isIdle in the Redux store also updates most recent action in local storage
 * If no action is taken since the idle popup is displayed for IDLE_TIMEms, logout and redirect to '/'
 */
export class AuthenticationContainer extends React.Component<allProps> {
  idleInterval: NodeJS.Timer;

  async componentWillReceiveProps(newProps: IProps) {
    const currentLocale = this.props.currentUser ? this.props.currentUser.locale : null;
    if (!newProps.loading && this.props.loading && !newProps.currentUser) {
      this.logout();
    } else if (newProps.currentUser) {
      // update current user if needed
      if (!this.props.currentUser || this.props.currentUser.id !== newProps.currentUser.id) {
        this.props.setCurrentUser(newProps.currentUser);
      }
      // change locale if needed
      if (newProps.currentUser.locale !== currentLocale) {
        this.props.selectLocale(newProps.currentUser.locale as Lang);
      }
    }
  }

  componentDidMount() {
    this.idleInterval = setInterval(this.checkIdle, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.idleInterval);
  }

  logout = async (): Promise<void> => {
    await localStorage.removeItem('authToken');
    this.props.setCurrentUser(null);
    window.location.pathname = '/';
  };

  checkIdle = async (): Promise<void> => {
    const { isIdle } = this.props;
    if (!this.props.currentUser) {
      return;
    }

    const lastAction = new Date().valueOf() - Number(await localStorage.getItem('lastAction'));
    if (isIdle && lastAction > IDLE_TIME) {
      this.logout();
    } else if (lastAction > IDLE_TIME) {
      this.props.idleStart();
    }
  };

  idleEnd = async (): Promise<void> => {
    const { isIdle } = this.props;
    const lastAction = new Date().valueOf() - Number(await localStorage.getItem('lastAction'));

    // Log out if last action was not recent enough
    if (isIdle && lastAction > IDLE_TIME) {
      this.logout();
    } else {
      this.props.idleEnd();
    }
  };

  render() {
    const { isIdle, currentUser } = this.props;

    let header = null;
    let app = null;
    let idle = null;
    let progressNote = null;
    if (currentUser) {
      header = <Header />;
      app = <div className={styles.app}>{this.props.children}</div>;
      idle = <IdlePopup idleEnd={this.idleEnd} isIdle={isIdle} logout={this.logout} />;
      progressNote = <ProgressNoteContainer currentUser={currentUser} />;
    }
    return (
      <div>
        {header}
        {app}
        {progressNote}
        {idle}
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: any): IStateProps {
  return {
    isIdle: state.idle.isIdle,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): IDispatchProps {
  return {
    selectLocale: (lang: Lang) => dispatch(selectLocale(lang)),
    idleStart: () => dispatch(idleStart()),
    idleEnd: () => dispatch(idleEnd()),
    setCurrentUser: (currentUser: CurrentUser) => dispatch(setCurrentUser(currentUser)),
  };
}

export default compose(
  connect<IStateProps, IDispatchProps, allProps>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps as any,
  ),
  graphql(currentUserQuery as any, {
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      currentUser: data ? (data as any).currentUser : null,
    }),
  }),
)(AuthenticationContainer) as React.ComponentClass<IProps>;
