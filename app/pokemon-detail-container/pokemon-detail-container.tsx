import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import singlePokemonGraphql from '../graphql/queries/get-single-pokemon.graphql';
import { getSinglePokemon } from '../graphql/types';
import styles from './css/pokemon-detail-container';
import ItemsList from './items-list';

interface IGraphqlProps {
  singlePokemon: getSinglePokemon['singlePokemon'];
  loading: boolean;
  error?: ApolloError | null;
}

interface IStateProps {
  pokemonId: string | null;
  match: any;
}

type allProps = IGraphqlProps & IStateProps;

const PokemonDetailContainer: React.StatelessComponent<allProps> = (props: allProps) => {
  const { singlePokemon } = props;

  if (!singlePokemon) {
    return null;
  }

  return (
    <div>
      <section className={styles.imageHolder}>
        <img src={singlePokemon.imageUrl} className={styles.image} />
      </section>
      <p>{singlePokemon.name}</p>
      <p>Type: {singlePokemon.pokeType}</p>
      <p>Attack: {singlePokemon.attack}</p>
      <p>Defense: {singlePokemon.defense}</p>
      <p>Moves: {singlePokemon.moves}</p>
      <ItemsList items={singlePokemon.items} />
    </div>
  );
};

export default graphql(singlePokemonGraphql, {
  options: (props: IStateProps) => ({
    variables: {
      pokemonId: props.match.params.pokemonId,
    },
  }),
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    singlePokemon: data ? (data as any).singlePokemon : null,
  }),
})(PokemonDetailContainer);
