import React from 'react';
import { compose, graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import getAllPokemon from '../graphql/queries/get-all-pokemon.graphql';
import { getAllPokemon_allPokemon } from '../graphql/types';

interface IProps {
  mutate?: any;
}

interface IGraphqlProps {
  allPokemon: getAllPokemon_allPokemon[];
}

type allProps = IProps & IGraphqlProps;

const PokemonListContainer:React.StatelessComponent<allProps> = ({ allPokemon }: allProps) => (
  <ul>
    {allPokemon.map((pokemon: getAllPokemon_allPokemon) => (
      <li key={pokemon.id}>
        <Link to={`/pokemon/${pokemon.id}`}>
          <img src={pokemon.imageUrl} />
          {pokemon.name}
        </Link>
      </li>
    ))}
  </ul>
);

export default compose(
  graphql(getAllPokemon, {
    props: ({ data: { allPokemon = [] } }: any) => ({ allPokemon })
  })
)(PokemonListContainer) as React.ComponentClass<IProps>;
