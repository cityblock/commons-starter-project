import React from 'react';
import { compose, graphql } from 'react-apollo';
import getPokemonsQuery from '../graphql/get-pokemons.graphql';
import { getPokemons } from '../graphql/types';
import styles from './css/main.css';


interface IGraphqlProps {
  pokemons?: getPokemons['pokemons'],
}

export const MainContainer: React.StatelessComponent<IGraphqlProps> = (props: IGraphqlProps) => {
  if (!props.pokemons) return null;

  return (
    <div className={styles.body}>
      <ul>
        {props.pokemons.map((pokemon) => (
          <li key={pokemon.id}>{pokemon.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default compose(
  graphql(getPokemonsQuery, {
    options: { fetchPolicy: 'network-only' },
    props: ({ data }) => ({
      pokemons: data ? (data as any).pokemons : null,
    }),
  }),
)(MainContainer) as React.ComponentClass<IGraphqlProps>;
