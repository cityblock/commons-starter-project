import React from 'react';
import styles from './css/main.css';
import PokemonListContainer from '../pokemon-list-container/pokemon-list-container';

const MainContainer: React.StatelessComponent = ({ children }) =>
  <div className={styles.body}>
    <PokemonListContainer />
    {children}
  </div>;

export default MainContainer;
