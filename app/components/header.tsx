import * as React from 'react';
import { Link } from 'react-router-dom';
import * as styles from '../css/components/header.css';

const Header = () => (
  <div className={styles.header}>
    <Link className={styles.link} to='/'>Magma</Link>
  </div>
);

export default Header;
