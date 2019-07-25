import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import getPokemon from '../graphql/queries/get-pokemon.graphql';
import { getPokemon_pokemon } from '../graphql/types';

interface IProps {
  mutate?: any;
  match: { 
    params: { 
      pokemonId: string;
    }; 
  };
}

interface IGraphqlProps {
  pokemon: getPokemon_pokemon;
}

type allProps = IProps & IGraphqlProps;

const detailContainerStyles = {
  top: 0,
  bottom: 0,
  right: 0,
  margin: 0,
  width: '60vw',
  position: 'fixed' as 'fixed',
  'overflow-y': 'scroll',
};

const detailImageStyles = {
  display: 'block',
  'max-width': '400px',
  'max-height': '400px'
};

const PokemonDetailContainer: React.StatelessComponent<allProps> = ({ pokemon }: allProps) => {
  if (!pokemon) return null;

  const items = pokemon.items || [];

  return (
    <div style={detailContainerStyles}>
      <h1>{pokemon.name}</h1>
      <p>Type: {pokemon.pokeType}</p>
      <p>Attack: {pokemon.attack}</p>
      <p>Defense: {pokemon.defense}</p>

      {!isEmpty(pokemon.moves) &&
        <p>
          Moves:
          <ul>
            {pokemon.moves.map(move => (
              <li key={move}>{move}</li>
            ))}
          </ul>
        </p>
      }

      <img src={pokemon.imageUrl} style={detailImageStyles} />

      {!isEmpty(items) &&
        <p>
          Items:
          <ul>
            {items.map(({ id, name, price, happiness, imageUrl }) => (
              <li key={id}>
                <p>Name: {name}</p>
                <p>Price: {price}</p>
                <p>Happiness: {happiness}</p>
                <img src={imageUrl} />
              </li>
            ))}
          </ul>
        </p>
      }
    </div>
  );
};

export default compose(
  graphql(getPokemon, {
    props: ({ data: { pokemon } }: any) => ({ pokemon }),
    options: ({ match: { params: { pokemonId } } }: IProps) => 
      ({ variables: { pokemonId } })
  })
)(PokemonDetailContainer) as React.ComponentClass<IProps>;
