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

const listContainerStyles = {
  top: 0,
  bottom: 0,
  margin: 0,
  width: '40vw',
  position: 'fixed' as 'fixed',
  'overflow-y': 'scroll',
  'list-style': 'none'
};

const listItemStyles = {
};

const itemImageContainerStyles = {
  width: '40px',
  height: '40px',
  display: 'inline-block',
  'text-align': 'center'
};

const itemImageStyles = {
  display: 'inline-block',
  'max-height': '40px',
  'max-width': '40px'
};

const itemTextStyles = {
  display: 'inline-block',
  'font-size': '19px'
};

const PokemonListContainer:React.StatelessComponent<allProps> = ({ allPokemon }: allProps) => (
  <ul style={listContainerStyles}>
    {allPokemon.map((pokemon: getAllPokemon_allPokemon) => (
      <li key={pokemon.id} style={listItemStyles}>
        <Link to={`/pokemon/${pokemon.id}`}>
          <span style={itemImageContainerStyles}>
            <img src={pokemon.imageUrl} style={itemImageStyles} />
          </span>
          <span style={itemTextStyles}>{pokemon.name}</span>
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
