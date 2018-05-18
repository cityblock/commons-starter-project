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

interface IProps extends IInjectedProps {
  mutate?: any;
  location: History.LocationState;
  logout: () => any;
}

type allProps = IProps & RouteComponentProps<IProps>;

export class Header extends React.Component<allProps> {
  getNavItemClassnames(path: string, exactMatch = false) {
    const { location } = this.props;
    const selected = exactMatch
      ? path === location.pathname
      : matchPath(location.pathname, { path }) !== null;

    return classNames(styles.navItem, {
      [styles.selected]: selected,
    });
  }

  render() {
    const { currentUser, featureFlags } = this.props;

    // if on contacts view, don't show navigation
    if (
      this.props.location.pathname === '/contacts' ||
      this.props.location.pathname.includes('voicemails')
    ) {
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
          <div className={classNames(styles.defaultIcon, styles.searchIcon)} />
          <FormattedMessage id="header.search">
            {(message: string) => <div className={styles.navText}>{message}</div>}
          </FormattedMessage>
        </Link>
      );
    }
    if (featureFlags.canViewAllMembers || featureFlags.canViewMembersOnPanel) {
      patientLink = (
        <Link to={'/patients'} className={this.getNavItemClassnames('/patients', true)}>
          <div className={classNames(styles.defaultIcon, styles.patientsIcon)} />
          <FormattedMessage id="header.patients">
            {(message: string) => <div className={styles.navText}>{message}</div>}
          </FormattedMessage>
        </Link>
      );
    }
    if (featureFlags.canViewAllMembers || featureFlags.canViewMembersOnPanel) {
      taskLink = (
        <Link
          to={'/tasks/assigned'}
          className={classNames(this.getNavItemClassnames('/tasks'), styles.relativeNavItem)}
        >
          <div className={classNames(styles.defaultIcon, styles.tasksIcon)} />
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

    const zendeskLink = (
      <Link
        to={'https://cityblock.zendesk.com/hc/en-us/requests/new'}
        target="_blank"
        className={styles.zendeskIconContainer}
      >
        <Icon className={styles.zendeskIcon} name="help" color="white" />
      </Link>
    );

    return (
      <div className={styles.header}>
        <div className={styles.container}>
          <div className={styles.left}>
            <Link className={styles.link} to={'/'}>
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
            {zendeskLink}
            <div className={styles.dropdownContainer}>
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
                  <div className={classNames(styles.smallIcon, styles.settingsIcon)} />
                  <FormattedMessage id="header.settings" />
                </Link>
                <a onClick={this.props.logout}>
                  <div className={classNames(styles.smallIcon, styles.logoutIcon)} />
                  <FormattedMessage id="header.logOut" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(withCurrentUser()(Header));
