import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { idleEnd, idleStart } from '../actions/idle-action';
import { selectLocale } from '../actions/locale-action';
import * as currentUserQuery from '../graphql/queries/get-current-user.graphql';
import { getCurrentUserQuery } from '../graphql/types';
import { IGraphqlProps } from '../manager-container/manager-users';
import ProgressNoteContainer from '../progress-note-container/progress-note-container';
import { Lang } from '../reducers/locale-reducer';
import { IState as IAppState } from '../store';
import * as styles from './css/auth.css';
import Header from './header';
import { IdlePopup } from './idle-popup';

interface IStateProps {
  isIdle: boolean;
}

export interface IDispatchProps {
  idleStart: () => any;
  idleEnd: () => any;
  selectLocale: (locale: Lang) => any;
}

interface IProps {
  error?: string | null;
  loading?: boolean;
  currentUser?: getCurrentUserQuery['currentUser'];
  children: any;
  data?: any;
}

const LOGOUT_TIME = 1800000; // 30 minutes
const IDLE_TIME = 1000000; // 18 minutes

type allProps = IProps & IStateProps & IDispatchProps;

export class AuthenticationContainer extends React.Component<allProps> {
  idleInterval: NodeJS.Timer;

  async componentWillReceiveProps(newProps: IProps) {
    const currentLocale = this.props.currentUser ? this.props.currentUser.locale : null;
    if (!newProps.loading && this.props.loading && !newProps.currentUser) {
      this.logout();
    } else if (newProps.currentUser && newProps.currentUser.locale !== currentLocale) {
      this.props.selectLocale(newProps.currentUser.locale as Lang);
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
    window.location.pathname = '/';
  };

  checkIdle = async (): Promise<void> => {
    const { isIdle } = this.props;
    if (!this.props.currentUser) {
      return;
    }

    const lastAction = new Date().valueOf() - Number(await localStorage.getItem('lastAction'));
    if (isIdle && lastAction > LOGOUT_TIME) {
      this.logout();
    } else if (!isIdle && lastAction > IDLE_TIME) {
      this.props.idleStart();
    }
  };

  render() {
    const { isIdle, currentUser } = this.props;

    let header = null;
    let app = null;
    let idle = null;
    let progressNote = null;
    if (currentUser) {
      header = <Header currentUser={currentUser} />;
      app = <div className={styles.app}>{this.props.children}</div>;
      idle = <IdlePopup idleEnd={this.props.idleEnd} isIdle={isIdle} />;
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

function mapDispatchToProps(dispatch: Dispatch<() => void>): IDispatchProps {
  return {
    selectLocale: (lang: Lang) => dispatch(selectLocale(lang)),
    idleStart: () => dispatch(idleStart()),
    idleEnd: () => dispatch(idleEnd()),
  };
}

export default compose(
  connect<IStateProps, IDispatchProps, allProps>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps,
  ),
  graphql<IGraphqlProps, IProps, allProps>(currentUserQuery as any, {
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      currentUser: data ? (data as any).currentUser : null,
    }),
  }),
)(AuthenticationContainer);
