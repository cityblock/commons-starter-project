import React from 'react';
import styles from './css/main.css';
import ErrorPopup from './error-popup';

const App: React.StatelessComponent<{}> = props => (
  <div className={styles.body}>
    {props.children}
    <ErrorPopup />
  </div>
);

export default App;
