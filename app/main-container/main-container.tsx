import React from 'react';
import PokemonListContainer from '../pokemon-list-container/pokemon-list-container';
import styles from './css/main.css';

const MainContainer: React.StatelessComponent = ({ children }) =>
  <div className={styles.body}>
    <PokemonListContainer />
    {children}
  </div>;

export default MainContainer;
