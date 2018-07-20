import React from 'react';
import { getSinglePokemon_singlePokemon_items } from '../graphql/types';

interface IProps {
  items: getSinglePokemon_singlePokemon_items[] | null;
}

const ItemsList: React.StatelessComponent<IProps> = (props: IProps) => {
  const { items } = props;

  if (!items) {
    return null;
  }

  const itemsList = items.map(item => {
    return (
      <li key={item.id}>
        <img src={item.imageUrl} />
        <p>{item.name}</p>
      </li>
    );
  });
  return <ul>{itemsList}</ul>;
};

export default ItemsList;
