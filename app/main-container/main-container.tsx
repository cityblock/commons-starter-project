import React from 'react';
import styles from './css/main.css';

import PokeListContainer from '../poke-list-container/poke-list-container';

const App: React.StatelessComponent<{}> = props => (
  <div className={styles.body}>
    <PokeListContainer />
    {props.children}
  </div>
);

export default App;
