import { pokemon } from 'app/graphql/types';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import currentPokemonGraphql from '../graphql/queries/pokemon-get-query.graphql';

interface IProps {
  mutate?: any;
  match: {
    params: {
      pokemonId: string;
    };
  };
}

interface IGraphqlProps {
  pokemon: pokemon['pokemon'] | null;
}

type allProps = IProps & IGraphqlProps;

const PokeDetail: React.StatelessComponent<allProps> = (props: allProps) => {
  // Decompose the properties
  const selectedPokemon = props.pokemon;

  // return if loading
  if (!selectedPokemon) {
    return null;
  }

  const style = { width: '50%' };
  const img = selectedPokemon.imageUrl || '';

  const content = {
    position: 'relative' as 'relative',
    marginLeft: '50vw',
    padding: '10px',
  };

  return (
    <div style={content}>
      <h1>{selectedPokemon.name}</h1>
      <p>Type: {selectedPokemon.pokeType}</p>
      <p>Attack: {selectedPokemon.attack}</p>
      <p>Defense: {selectedPokemon.defense}</p>
      <p>Moves: {selectedPokemon.moves} </p>
      <img src={img} {...style} />
    </div>
  );
};

export default compose(
  graphql(currentPokemonGraphql, {
    options: (props: IProps) => {
      return {
        fetchPolicy: 'network-only',
        variables: {
          pokemonId: props.match.params.pokemonId,
        },
      };
    },
    props: ({ data }): IGraphqlProps => ({
      pokemon: data ? (data as any).pokemon : null,
    }),
  }),
)(PokeDetail) as React.ComponentClass<IProps>;
