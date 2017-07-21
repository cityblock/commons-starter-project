import * as React from 'react';
import * as styles from './css/main.css';

const App: React.StatelessComponent<{}> = props => (
  <div>
    <div className={styles.body}>
      {props.children}
    </div>
  </div>
);

export default App;
