import * as classNames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { matchPath, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { updateEventNotificationsCount } from '../actions/event-notifications-action';
import { formatEventNotifications } from '../event-notifications-container/event-notifications-container';
import * as eventNotificationsQuery from '../graphql/queries/get-event-notifications-for-current-user.graphql';
import { getEventNotificationsForCurrentUserQuery, FullUserFragment } from '../graphql/types';
import { IState as IAppState } from '../store';
import * as styles from './css/header.css';

interface IProps {
  currentUser: FullUserFragment;
  mutate?: any;
  location: History.LocationState;
}

interface IGraphqlProps {
  eventNotificationsResponse?: getEventNotificationsForCurrentUserQuery['eventNotificationsForCurrentUser'];
}

interface IDispatchProps {
  updateNotificationsCount?: (count: number) => any;
}

interface IStateProps {
  notificationsCount?: number;
}

type allProps = IGraphqlProps & IStateProps & IDispatchProps & IProps;

class Header extends React.Component<allProps> {
  constructor(props: allProps) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  componentWillReceiveProps(nextProps: allProps) {
    const { updateNotificationsCount } = this.props;
    const { eventNotificationsResponse } = nextProps;

    const formattedNotifications = formatEventNotifications(eventNotificationsResponse);

    if (updateNotificationsCount) {
      updateNotificationsCount(formattedNotifications.length);
    }
  }

  async logout() {
    await localStorage.removeItem('authToken');
    window.location.href = '/';
  }

  getNavItemClassnames(path: string) {
    const { location } = this.props;
    const selected = matchPath(location.pathname, { path }) !== null;

    return classNames(styles.navItem, {
      [styles.selected]: selected,
    });
  }

  render() {
    const { currentUser, notificationsCount } = this.props;
    const name =
      currentUser.firstName && currentUser.lastName
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : null;
    let builderLink = null;
    let managerLink = null;
    if (currentUser.userRole === 'admin') {
      builderLink = (
        <Link to={'/builder'} className={this.getNavItemClassnames('/builder')}>
          <div className={styles.tasksIcon} />
          <FormattedMessage id="header.builder">
            {(message: string) => <div className={styles.navText}>{message}</div>}
          </FormattedMessage>
        </Link>
      );
      managerLink = (
        <Link to={'/manager'} className={this.getNavItemClassnames('/manager')}>
          <div className={styles.tasksIcon} />
          <FormattedMessage id="header.manager">
            {(message: string) => <div className={styles.navText}>{message}</div>}
          </FormattedMessage>
        </Link>
      );
    }
    const tasksBadgeStyles = classNames(styles.notificationBadge, {
      [styles.visible]: !!notificationsCount && notificationsCount > 0,
    });

    return (
      <div className={styles.header}>
        <div className={styles.container}>
          <div className={styles.left}>
            <Link className={styles.link} to="/dashboard/tasks">
              <div className={styles.mark} />
            </Link>
            <Link to={'/search'} className={this.getNavItemClassnames('/search')}>
              <div className={styles.searchIcon} />
              <FormattedMessage id="header.search">
                {(message: string) => <div className={styles.navText}>{message}</div>}
              </FormattedMessage>
            </Link>
            <Link to={'/patients'} className={this.getNavItemClassnames('/patients')}>
              <div className={styles.patientsIcon} />
              <FormattedMessage id="header.patients">
                {(message: string) => <div className={styles.navText}>{message}</div>}
              </FormattedMessage>
            </Link>
            <Link to={'/tasks'} className={
              classNames(this.getNavItemClassnames('/tasks'),
              styles.relativeNavItem)
            }>
              <div className={styles.tasksIcon} />
              <FormattedMessage id="header.tasks">
                {(message: string) => <div className={styles.navText}>{message}</div>}
              </FormattedMessage>
              <div className={tasksBadgeStyles} />
            </Link>
            {builderLink}
            {managerLink}
          </div>
          <div className={styles.right}>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{name}</div>
              <div className={styles.userRole}>{currentUser.userRole}</div>
            </div>
            <div
              className={styles.userPhoto}
              style={{ backgroundImage: `url('${currentUser.googleProfileImageUrl}')` }}
            />
            <div className={styles.dropdown}>
              <Link to={'/settings'}>
                <div className={styles.settingsIcon} />
                <FormattedMessage id="header.settings" />
              </Link>
              <a onClick={this.logout}>
                <div className={styles.logoutIcon} />
                <FormattedMessage id="header.logOut" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: {}): IStateProps {
  return {
    notificationsCount: state.eventNotifications.count,
  };
}

function mapDispatchToProps(dispatch: Dispatch<() => void>): IDispatchProps {
  return {
    updateNotificationsCount: (count: number) => dispatch(updateEventNotificationsCount(count)),
  };
}

export default compose(
  withRouter,
  connect<IStateProps, IDispatchProps, IProps>(mapStateToProps as any, mapDispatchToProps),
  graphql<IGraphqlProps, IProps, allProps>(eventNotificationsQuery as any, {
    options: (props: allProps) => {
      const variables: any = { pageNumber: 0, pageSize: 15 };
      return { variables };
    },
    props: ({ data, ownProps }) => ({
      eventNotificationsResponse: data ? (data as any).eventNotificationsForCurrentUser : null,
    }),
  }),
)(Header);
