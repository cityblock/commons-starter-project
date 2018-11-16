import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import getAllPokemonQuery from '../graphql/queries/get-all-pokemon.graphql';
import { getAllPokemon } from '../graphql/types';
import styles from './css/main.css';

interface IGraphqlProps {
  pokemon: getAllPokemon['allPokemon'];
  loading: boolean;
  error?: ApolloError | null;
}

const MainContainer: React.StatelessComponent<IGraphqlProps> = props => {
  const pokemonHtml = (props.pokemon || []).map(pokemon => (
    <div key={pokemon.id}>{pokemon.name}</div>
  ));
  return (
    <div className={styles.body}>
      <h1>Pokedex</h1>
      {props.children}
      {pokemonHtml}
    </div>
  );
};

export default graphql(getAllPokemonQuery, {
  options: () => ({
    fetchPolicy: 'network-only',
  }),
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    pokemon: data ? (data as any).allPokemon : null,
  }),
})(MainContainer);
