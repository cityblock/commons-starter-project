import React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import pokemonGraphql from '../graphql/queries/get-pokemon.graphql';
import { getPokemon } from '../graphql/types';
import styles from './css/pokemon-detail.css';

interface IProps {
  mutate?: any;
  match: {
    params: {
      pokemonId: string;
    };
  };
}

interface IGraphqlProps extends getPokemon {
  pokemonLoading?: boolean;
  pokemonError?: string | null;
}

type allProps = IProps & IGraphqlProps;

export const PokemonDetail: React.StatelessComponent<allProps> = (props: allProps) => {
  const { pokemon, pokemonLoading, pokemonError } = props;

  // return spinner if loading
  if (pokemonLoading || pokemonError || !pokemon) {
    return <p> fetching your pokemon! </p>;
  }
  return (
    <div className={styles.container}>
      <p>{pokemon.name}</p>
      <p>{pokemon.attack}</p>
      <p>{pokemon.defense}</p>
      <p>{pokemon.pokeType}</p>
    </div>
  );
};

export default compose(
  graphql(pokemonGraphql, {
    options: (props: IProps) => ({
      variables: { pokemonId: props.match.params.pokemonId },
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => ({
      pokemonLoading: data ? data.loading : false,
      pokemonError: data ? data.error : null,
      pokemon: data ? (data as any).pokemon : null,
    }),
  }),
)(PokemonDetail) as React.ComponentClass<IProps>;
