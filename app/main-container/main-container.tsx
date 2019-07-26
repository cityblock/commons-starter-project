import React from 'react';
import PokemonListContainer from '../pokemon-list-container/pokemon-list-container';
import styles from './css/main.css';

const viewContainerStyles = {
  top: 0,
  bottom: 0,
  right: 0,
  margin: 0,
  width: '60vw',
  position: 'fixed' as 'fixed',
  overflowY: 'scroll' as 'scroll'
};

const MainContainer: React.StatelessComponent = ({ children }) =>
  <div className={styles.body}>
    <PokemonListContainer />
    <div style={viewContainerStyles}>
      {children}
    </div>
  </div>;

export default MainContainer;
