import * as React from 'react';
import { Link } from 'react-router-dom';
import * as styles from '../css/components/header.css';

const Header = () => (
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
        <div className={styles.userInfo}>User info here!</div>
      </div>
    </div>
  </div>
);

export default Header;
