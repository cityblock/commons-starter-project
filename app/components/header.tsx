import * as React from 'react';
import { Link } from 'react-router-dom';
import * as styles from '../css/components/header.css';
import { FullUserFragment } from '../graphql/types';

interface IProps {
  currentUser: FullUserFragment;
}

export const Header: React.StatelessComponent<IProps> = props => {
  const { currentUser } = props;
  const name = currentUser.firstName && currentUser.lastName ?
    `${currentUser.firstName} ${currentUser.lastName}` : null;
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.hamburger} />
          <div className={styles.searchIcon} />
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
        </div>
      </div>
    </div>);
};
