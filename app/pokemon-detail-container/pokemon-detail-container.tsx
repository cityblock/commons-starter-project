import React from 'react';
import { compose, graphql } from 'react-apollo';
import getPokemon from '../graphql/queries/get-pokemon.graphql';
import { getPokemon_pokemon } from '../graphql/types';

interface IProps {
  mutate?: any;
  match: { 
    params: { 
      pokemonId: string;
    }; 
  };
}

interface IGraphqlProps {
  pokemon: getPokemon_pokemon;
}

type allProps = IProps & IGraphqlProps;

const PokemonDetailContainer: React.StatelessComponent<allProps> = ({ pokemon }: allProps) => {
  if (!pokemon) return null;

  return (
    <React.Fragment>
      <h1>{pokemon.name}</h1>
      <p>Type: {pokemon.pokeType}</p>
      <p>Attack: {pokemon.attack}</p>
      <p>Defense: {pokemon.defense}</p>
      <p>Moves: {pokemon.moves}</p>
      <img src={pokemon.imageUrl} />
    </React.Fragment>
  );
};

export default compose(
  graphql(getPokemon, {
    props: ({ data: { pokemon } }: any) => ({ pokemon }),
    options: ({ match: { params: { pokemonId } } }: IProps) => 
      ({ variables: { pokemonId } })
  })
)(PokemonDetailContainer) as React.ComponentClass<IProps>;
