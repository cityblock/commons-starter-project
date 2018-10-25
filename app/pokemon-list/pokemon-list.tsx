import React from 'react';
import { graphql } from 'react-apollo';
import { ApolloError } from 'apollo-client';
import { getAllPokemon } from '../graphql/types';
import getAllPokemonGraphql from '../graphql/queries/get-all-pokemon.graphql';
import styles from './css/pokemon-list.css';

interface IGraphqlProps {
  pokemonList: getAllPokemon['pokemon'];
  loading?: boolean;
  error?: ApolloError | null;
}

interface IProps {
  children?: any;
}

type allProps = IGraphqlProps & IProps;

const PokemonList: React.StatelessComponent<allProps> = (props: allProps) => {
  const { pokemonList, loading, error } = props;

  if (loading || error) {
    return <h1>Loading...</h1>;
  }

  const getPokemonListElement = pokemonList.map(onePokemon => {
    return (
      <li className={styles.listItem} key={onePokemon.id}>
        <img className={styles.pokemonImg} src={onePokemon.imageUrl} />
        <p className={styles.pokemonChild}>{onePokemon.name}</p>
      </li>
    );
  });

  return (
    <div className={styles.listContainer}>
      <ul>{getPokemonListElement}</ul>
    </div>
  );
};

export default graphql(getAllPokemonGraphql, {
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    pokemonList: data ? (data as any).pokemon : null,
  }),
})(PokemonList);

export { PokemonList };
