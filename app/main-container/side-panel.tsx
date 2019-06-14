import React from 'react';
import { compose, graphql } from 'react-apollo';
import pokemonsGraphql from '../graphql/queries/get-pokemons.graphql';
import { getPokemons } from '../graphql/types';
import PokemonRow from './pokemon-row';

interface IProps {
  mutate?: any;
}

interface IGraphqlProps extends getPokemons {
  pokemonLoading?: boolean;
  pokemonError?: string | null;
}

type allProps = IProps & IGraphqlProps;

export const SidePanel: React.StatelessComponent<allProps> = (props: allProps) => {
  const { pokemons, pokemonLoading, pokemonError } = props;

  // return spinner if loading
  if (pokemonLoading || pokemonError || !pokemons) {
    return <p> recalculating!!! </p>;
  }

  const result = pokemons.map((pokemon, index) => <PokemonRow key={index} pokemon={pokemon} />);
  return <div>{result}</div>;
};

export default compose(
  graphql(pokemonsGraphql, {
    options: { fetchPolicy: 'network-only' },
    props: ({ data }) => ({
      pokemonLoading: data ? data.loading : false,
      pokemonError: data ? data.error : null,
      pokemons: data ? (data as any).pokemons : null,
    }),
  }),
)(SidePanel) as React.ComponentClass<IProps>;
