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

const detailImageStyles = {
  maxWidth: '400px',
  maxHeight: '400px'
};

export const PokemonDetailContainer: React.StatelessComponent<allProps> = ({ pokemon }: allProps) => {
  if (!pokemon) return <div/>;

  const items = pokemon.items || [];

  return (
    <React.Fragment>
      <h1>{pokemon.name}</h1>
      <p>Type: {pokemon.pokeType}</p>
      <p>Attack: {pokemon.attack}</p>
      <p>Defense: {pokemon.defense}</p>

      {!isEmpty(pokemon.moves) &&
        <div>
          Moves:
          <ul>
            {pokemon.moves.map(move => (
              <li key={move}>{move}</li>
            ))}
          </ul>
        </div>
      }

      <img src={pokemon.imageUrl} style={detailImageStyles} />

      {!isEmpty(items) &&
        <div>
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
        </div>
      }
    </React.Fragment>
  );
};

export default compose(
  graphql(getPokemon, {
    props: ({ data: { pokemon } }: any) => ({ pokemon }),
    options: ({ match: { params: { pokemonId } } }: IProps) => 
      ({ variables: { pokemonId } })
  })
)(PokemonDetailContainer) as React.ComponentClass<IProps>;
