import * as React from 'react';
import * as styles from './css/main.css';

const App: React.StatelessComponent<{}> = props => (
  <div className={styles.body}>{props.children}</div>
);

export default App;
