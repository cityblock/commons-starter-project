import React from 'react';
import styles from './css/main.css';
import PokemonList from '../pokemon-list/pokemon-list';

export const MainContainer: React.StatelessComponent = () => {
  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <PokemonList />
      </div>
    </div>
  );
};

export default MainContainer;
