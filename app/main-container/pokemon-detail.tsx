import React from 'react';
import { compose, graphql } from 'react-apollo';
import pokemonGraphql from '../graphql/queries/get-pokemon.graphql';
import { getPokemon } from '../graphql/types';
import styles from './css/pokemon-detail.css';
import ItemRow from './pokemon-item-detail';

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
  const pokeMove = pokemon.moves.join(', ');
  const pokeItems = pokemon.item.map((item, index) => <ItemRow key={index} item={item} />);

  return (
    <div className={styles.container}>
      <p>
        <b>name: </b> {pokemon.name}
      </p>
      <p>
        <b>attack: </b> {pokemon.attack}
      </p>
      <p>
        <b>defense:</b> {pokemon.defense}
      </p>
      <p>
        <b>poketype:</b> {pokemon.pokeType}
      </p>
      <p>
        <b>poke-moves:</b> {pokeMove}
      </p>
      <div>
        <b>----------------------------------------------------------->poke-items</b> {pokeItems}
      </div>
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
