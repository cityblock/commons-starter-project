import * as classNames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { matchPath, withRouter, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { formatFullName } from '../shared/helpers/format-helpers';
import Icon from '../shared/library/icon/icon';
import withCurrentUser, { IInjectedProps } from '../shared/with-current-user/with-current-user';
import * as styles from './css/header.css';
import { getHomeRoute } from './helpers';

interface IProps extends IInjectedProps {
  mutate?: any;
  location: History.LocationState;
}

type allProps = IProps & RouteComponentProps<IProps>;

export class Header extends React.Component<allProps> {
  logout = async (): Promise<void> => {
    await localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  getNavItemClassnames(path: string) {
    const { location } = this.props;
    const selected = matchPath(location.pathname, { path }) !== null;

    return classNames(styles.navItem, {
      [styles.selected]: selected,
    });
  }

  render() {
    const { currentUser, featureFlags } = this.props;

    // if on contacts view, don't show navigation
    if (this.props.location.pathname === '/contacts') {
      return null;
    }

    const name = currentUser ? formatFullName(currentUser.firstName, currentUser.lastName) : null;
    let searchLink = null;
    let patientLink = null;
    let taskLink = null;
    let builderLink = null;
    let managerLink = null;
    if (featureFlags.canViewAllMembers) {
      searchLink = (
        <Link to={'/search'} className={this.getNavItemClassnames('/search')}>
          <div className={styles.searchIcon} />
          <FormattedMessage id="header.search">
            {(message: string) => <div className={styles.navText}>{message}</div>}
          </FormattedMessage>
        </Link>
      );
    }
    if (featureFlags.canViewAllMembers || featureFlags.canViewMembersOnPanel) {
      patientLink = (
        <Link to={'/patients'} className={this.getNavItemClassnames('/patients')}>
          <div className={styles.patientsIcon} />
          <FormattedMessage id="header.patients">
            {(message: string) => <div className={styles.navText}>{message}</div>}
          </FormattedMessage>
        </Link>
      );
    }
    if (featureFlags.canViewAllMembers || featureFlags.canViewMembersOnPanel) {
      taskLink = (
        <Link
          to={'/tasks'}
          className={classNames(this.getNavItemClassnames('/tasks'), styles.relativeNavItem)}
        >
          <div className={styles.tasksIcon} />
          <FormattedMessage id="header.tasks">
            {(message: string) => <div className={styles.navText}>{message}</div>}
          </FormattedMessage>
          <div className={styles.notificationBadge} />
        </Link>
      );
    }
    if (featureFlags.isBuilderEnabled && process.env.IS_BUILDER_ENABLED === 'true') {
      builderLink = (
        <Link to={'/builder'} className={this.getNavItemClassnames('/builder')}>
          <div className={styles.tasksIcon} />
          <FormattedMessage id="header.builder">
            {(message: string) => <div className={styles.navText}>{message}</div>}
          </FormattedMessage>
        </Link>
      );
    }
    if (featureFlags.isManagerEnabled) {
      managerLink = (
        <Link to={'/manager'} className={this.getNavItemClassnames('/manager')}>
          <div className={styles.tasksIcon} />
          <FormattedMessage id="header.manager">
            {(message: string) => <div className={styles.navText}>{message}</div>}
          </FormattedMessage>
        </Link>
      );
    }
    const calendarLink = (
      <Link
        to={'/calendar'}
        className={classNames(this.getNavItemClassnames('/calendar'), styles.relativeNavItem)}
      >
        <Icon className={styles.calendarIcon} name="today" color="white" />
        <FormattedMessage id="header.calendar">
          {(message: string) => <div className={styles.navText}>{message}</div>}
        </FormattedMessage>
      </Link>
    );

    return (
      <div className={styles.header}>
        <div className={styles.container}>
          <div className={styles.left}>
            <Link className={styles.link} to={getHomeRoute(featureFlags)}>
              <div className={styles.mark} />
            </Link>
            {searchLink}
            {patientLink}
            {taskLink}
            {calendarLink}
            {builderLink}
            {managerLink}
          </div>
          <div className={styles.right}>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{name}</div>
              <div className={styles.userRole}>{currentUser ? currentUser.userRole : ''}</div>
            </div>
            <div
              className={styles.userPhoto}
              style={{
                backgroundImage: `url('${currentUser ? currentUser.googleProfileImageUrl : ''}')`,
              }}
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

export default withRouter(withCurrentUser()(Header));
