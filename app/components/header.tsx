import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import * as styles from '../css/components/header.css';
import { FullUserFragment } from '../graphql/types';

export interface IProps {
  currentUser: FullUserFragment;
}

async function logout() {
  await localStorage.removeItem('authToken');
  window.location.href = '/';
}

const Header: React.StatelessComponent<IProps> = props => {
  const { currentUser } = props;
  const name = currentUser.firstName && currentUser.lastName ?
    `${currentUser.firstName} ${currentUser.lastName}` : null;
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.hamburger} />
          <div className={styles.navItem}>
            <div className={styles.searchIcon} />
            <FormattedMessage id='header.search' />
          </div>
          <Link to={'/patients'} className={styles.navItem}>
            <div className={styles.patientsIcon} />
            <FormattedMessage id='header.patients' />
          </Link>
          <Link to={'/tasks'} className={styles.navItem}>
            <div className={styles.tasksIcon} />
            <FormattedMessage id='header.tasks' />
          </Link>
        </div>
        <div className={styles.center}>
          <Link className={styles.link} to='/'>Commons</Link>
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
            <a onClick={logout}>
              <div className={styles.logoutIcon} />
              <FormattedMessage id='header.logOut' />
            </a>
          </div>
        </div>
      </div>
    </div>);
};

export default Header;
