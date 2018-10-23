import React from 'react';
import { graphql } from 'react-apollo';
import { getAllPokemon } from '../graphql/types';
import getAllPokemonGraphql from '../graphql/queries/get-all-pokemon.graphql';
import styles from './css/pokemon-list.css';

interface IGraphqlProps {
  pokemonList: getAllPokemon['pokemon'];
  loading?: boolean;
  error?: string | null;
}

interface IProps {
  children?: any;
}

export type allProps = IGraphqlProps & IProps;

const PokemonList: React.StatelessComponent<allProps> = (props: allProps) => {
  const { pokemonList, loading, error } = props;

  if (loading || error) {
    return <h1>Loading...</h1>;
  }

  console.log(pokemonList);

  const getPokemonList = pokemonList.map(onePokemon => {
    return (
      <div className={styles.pokemonDetail} key={onePokemon.id}>
        <img src={onePokemon.imageUrl} />
        <p className={styles.pokemonChild}>{onePokemon.name}</p>
      </div>
    );
  });

  return (
    <div className={styles.listContainer}>
      <ul>
        <li className={styles.listItem}>{getPokemonList}</li>
      </ul>
    </div>
  );
};

export default graphql(getAllPokemonGraphql, {
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    allPokemon: data ? (data as any).allPokemon : null,
  }),
})(PokemonList);
