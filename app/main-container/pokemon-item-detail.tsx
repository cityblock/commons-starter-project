import React from 'react';
import { getItem_item } from '../graphql/types';
import styles from './css/pokemon-detail.css';

interface IProps {
  item: getItem_item;
}

export const ItemRow: React.StatelessComponent<IProps> = (props: IProps) => {
  const { item } = props;
  return (
    <div className={styles.container}>
      <p>
        <b>item name: </b>
        {item.name}
      </p>
      <p>
        <b>item price: </b>
        {item.price}
      </p>
      <p>
        <b>item happiness: </b>
        {item.happiness}
      </p>
    </div>
  );
};

export default ItemRow;
