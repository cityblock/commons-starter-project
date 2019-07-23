import React from 'react';
import styles from './css/main.css';

export const MainContainer: React.StatelessComponent = () => {
  return (
    <div className={styles.body}>
      <h1>Jaygle's Bagels</h1>
      <h2>We Don't Sell Bagels, We Sell Sushi</h2>
    </div>
  );
};

export default MainContainer;
