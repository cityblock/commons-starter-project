import React from 'react';
import styles from './css/main.css';
import SidePanel from './side-panel';

export const MainContainer: React.StatelessComponent = props => {
  return (
    <div className={styles.body}>
      <SidePanel />
      {props.children}
    </div>
  );
};

export default MainContainer;
