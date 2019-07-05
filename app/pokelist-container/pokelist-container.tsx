import { fullPokemon } from 'app/graphql/types';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import pokemonsGraphql from '../graphql/queries/pokemon-getall-query.graphql';

interface IProps {
  mutate?: any;
}

interface IGraphqlProps {
  pokemons: fullPokemon[] | null;
}

type allProps = IProps & IGraphqlProps;

const PokeList: React.StatelessComponent<allProps> = (props: allProps) => {
  // Decompose the properties
  const { pokemons } = props;

  if (!pokemons) return null;

  console.log('pokemons', pokemons);

  const style = { width: '10%' };
  return (
    <ul>
      {pokemons.map((item: fullPokemon) => (
        <li key={item.id}>
          <Link to={`/pokemon/${item.id}`}>
            <img src={`${item.imageUrl}`} {...style} />
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default compose(
  graphql(pokemonsGraphql, {
    options: { fetchPolicy: 'network-only' },
    props: ({ data }) => ({
      pokemons: data ? (data as any).pokemons : null,
    }),
  }),
)(PokeList) as React.ComponentClass<IProps>;
