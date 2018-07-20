import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
// GraphQL query
import allPokemonGraphql from '../graphql/queries/get-all-pokemon.graphql';
// frontend type
import { getAllPokemon } from '../graphql/types';

import allPokemonStyles from './css/all-pokemon.css';
import styles from './css/main.css';

interface IGraphqlProps {
  allPokemon: getAllPokemon['allPokemon'];
  loading: boolean;
  error?: ApolloError | null;
}

interface IProps {
  children?: any;
}

type allProps = IGraphqlProps & IProps;

const AllPokemonContainer: React.StatelessComponent<allProps> = (props: allProps) => {
  const { allPokemon, loading, error } = props;

  if (loading || error) {
    return <h1>Loading...</h1>;
  }

  const renderedPokemon = allPokemon.map(pokemon => {
    return (
      <div key={pokemon.id}>
        <img className={allPokemonStyles.pokemonImage} src={pokemon.imageUrl} />
        <p>{pokemon.name}</p>
      </div>
    );
  });

  return (
    <div className={styles.body}>
      <div className={allPokemonStyles.appContainer}>
        <div className={allPokemonStyles.leftRail}>{renderedPokemon}</div>
        {props.children}
      </div>
    </div>
  );
};

export default graphql(allPokemonGraphql, {
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    allPokemon: data ? (data as any).allPokemon : null,
  }),
})(AllPokemonContainer);
