import * as React from 'react';
import { graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { idleEnd, idleStart } from '../actions/idle-action';
import { selectLocale } from '../actions/locale-action';
import * as currentUserQuery from '../graphql/queries/get-current-user.graphql';
import { FullUserFragment } from '../graphql/types';
import { Lang } from '../reducers/locale-reducer';
import { IState as IAppState } from '../store';
import * as styles from './css/auth.css';
import Header from './header';
import { IdlePopup } from './idle-popup';

export interface IStateProps {
  isIdle: boolean;
}

export interface IDispatchProps {
  idleStart: () => any;
  idleEnd: () => any;
  selectLocale: (locale: Lang) => any;
}

export interface IProps {
  error?: string;
  loading?: boolean;
  currentUser?: FullUserFragment;
  children: any;
  data?: any;
}

const LOGOUT_TIME = 1800000; // 30 minutes
const IDLE_TIME = 1000000; // 18 minutes

class Authentication extends React.Component<IProps & IStateProps & IDispatchProps, {}> {
  idleInterval: NodeJS.Timer;

  constructor(props: IProps & IStateProps & IDispatchProps) {
    super(props);
    this.logout = this.logout.bind(this);
    this.checkIdle = this.checkIdle.bind(this);
  }

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

  async logout() {
    await localStorage.removeItem('authToken');
    window.location.href = '/';
  }

  async checkIdle() {
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
  }

  render() {
    const { isIdle } = this.props;
    let header = null;
    let app = null;
    let idle = null;
    if (this.props.currentUser) {
      header = <Header currentUser={this.props.currentUser} />;
      app = <div className={styles.app}>{this.props.children}</div>;
      idle = <IdlePopup idleEnd={this.props.idleEnd} isIdle={isIdle} />;
    }
    return (
      <div>
        {header}
        {app}
        {idle}
      </div>
    );
  }
}

function mapStateToProps(state: IAppState): IStateProps {
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

const AuthenticationWithGraphQL = graphql<
  {},
  IStateProps & IDispatchProps,
  IProps
>(currentUserQuery as any, {
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    currentUser: data ? (data as any).currentUser : null,
  }),
})(Authentication);

export default connect<IStateProps, IDispatchProps, IProps>(mapStateToProps, mapDispatchToProps)(
  AuthenticationWithGraphQL,
);
