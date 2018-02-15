import * as classNames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { matchPath, withRouter, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import withCurrentUser, { IInjectedProps } from '../shared/with-current-user/with-current-user';
import * as styles from './css/header.css';

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

    const name =
      currentUser.firstName && currentUser.lastName
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : null;
    let builderLink = null;
    let managerLink = null;
    if (featureFlags.isBuilderEnabled) {
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

export default withRouter(withCurrentUser()(Header));
