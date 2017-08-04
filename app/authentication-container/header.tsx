import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateEventNotificationsCount } from '../actions/event-notifications-action';
import {
  formatEventNotifications,
} from '../event-notifications-container/event-notifications-container';
/* tslint:disable:max-line-length */
import * as eventNotificationsQuery from '../graphql/queries/get-event-notifications-for-current-user.graphql';
/* tslint:enable:max-line-length */
import { getEventNotificationsForCurrentUserQuery, FullUserFragment } from '../graphql/types';
import { IState as IAppState } from '../store';
import * as styles from './css/header.css';

export interface IProps {
  currentUser: FullUserFragment;
  notificationsCount?: number;
  updateNotificationsCount?: (count: number) => any;
  eventNotificationsResponse?:
    getEventNotificationsForCurrentUserQuery['eventNotificationsForCurrentUser'];
}

class Header extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  componentWillReceiveProps(nextProps: IProps) {
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

  render() {
    const { currentUser, notificationsCount } = this.props;
    const name = currentUser.firstName && currentUser.lastName ?
      `${currentUser.firstName} ${currentUser.lastName}` : null;
    let adminLink = null;
    if (currentUser.userRole === 'admin') {
      adminLink = (
        <Link to={'/admin'} className={styles.navItem}>
          <div className={styles.tasksIcon} />
          <FormattedMessage id='header.admin'>
            {(message: string) => <div className={styles.navText}>{message}</div>}
          </FormattedMessage>
        </Link>);
    }
    const tasksBadgeStyles = classNames(styles.notificationBadge, {
      [styles.visible]: !!notificationsCount && notificationsCount > 0,
    });

    return (
      <div className={styles.header}>
        <div className={styles.container}>
          <div className={styles.left}>
            <Link className={styles.link} to='/'>
              <div className={styles.mark} />
            </Link>
            <div className={styles.navItem}>
              <div className={styles.searchIcon} />
              <FormattedMessage id='header.search'>
                {(message: string) => <div className={styles.navText}>{message}</div>}
              </FormattedMessage>
            </div>
            <Link to={'/patients'} className={styles.navItem}>
              <div className={styles.patientsIcon} />
              <FormattedMessage id='header.patients'>
                {(message: string) => <div className={styles.navText}>{message}</div>}
              </FormattedMessage>
            </Link>
            <Link to={'/tasks'} className={classNames(styles.navItem, styles.relativeNavItem)}>
              <div className={styles.tasksIcon} />
              <FormattedMessage id='header.tasks'>
                {(message: string) => <div className={styles.navText}>{message}</div>}
              </FormattedMessage>
              <div className={tasksBadgeStyles} />
            </Link>
            {adminLink}
          </div>
          <div className={styles.right}>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{name}</div>
              <div className={styles.userRole}>{currentUser.userRole}</div>
            </div>
            <div className={styles.userPhoto} style={
              { backgroundImage: `url('${currentUser.googleProfileImageUrl}')` }
            } />
            <div className={styles.dropdown}>
              <Link to={'/settings'}>
                <div className={styles.settingsIcon} />
                <FormattedMessage id='header.settings' />
              </Link>
              <a onClick={this.logout}>
                <div className={styles.logoutIcon} />
                <FormattedMessage id='header.logOut' />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): Partial<IProps> {
  return {
    notificationsCount: state.eventNotifications.count,
  };
}

function mapDispatchToProps(dispatch: Dispatch<() => void>): Partial<IProps> {
  return {
    updateNotificationsCount: (count: number) =>
      dispatch(updateEventNotificationsCount(count)),
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(eventNotificationsQuery as any, {
    options: (props: IProps) => {
      const variables: any = { pageNumber: 0, pageSize: 15 };

      return { variables };
    },
    props: ({ data, ownProps }) => ({
      eventNotificationsResponse: (data ? (data as any).eventNotificationsForCurrentUser : null),
    }),
  }),
)(Header);
