import React from 'react';
import { Link } from 'react-router-dom';
import { getPokemons_pokemons } from '../graphql/types';

interface IProps {
  pokemon: getPokemons_pokemons;
}

export const PokemonRow: React.StatelessComponent<IProps> = (props: IProps) => {
  const { pokemon } = props;
  // return <p>{pokemon.name}</p>;
  return (
    <p>
      <Link to={`/pokemon/${pokemon.id}`}>{pokemon.name}</Link>
    </p>
  );
};

export default PokemonRow;
