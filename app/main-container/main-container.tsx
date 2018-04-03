import * as React from 'react';
import * as styles from './css/main.css';
import ErrorPopup from './error-popup';

const App: React.StatelessComponent<{}> = props => (
  <div className={styles.body}>
    {props.children}
    <ErrorPopup />
  </div>
);

export default App;
