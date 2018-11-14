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

export const MainContainer: React.StatelessComponent<{}> = (props: IGraphqlProps) => {
  return (
    <div className={styles.body}>
      <h1>Pokedex</h1>
    </div>
  );
};

export default graphql(getAllPokemonQuery, {
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    pokemon: data ? (data as any).pokemon : null,
  }),
})(MainContainer);
