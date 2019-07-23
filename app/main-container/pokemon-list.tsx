import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';

const POKEMON_LIST = gql`
  {
    allPokemon {
      id
      name
      imageUrl
      pokemonNumber
    }
  }
`;

interface IGraphQL {
  loading: boolean;
  error: string | null;
}

interface IPokemonData {
  allPokemon: IPokemon[];
}

type allQueryTypes = IGraphQL & IPokemonData;

interface IPokemon {
  id: string;
  name: string;
  imageUrl: string;
  pokemonNumber: number;
}

export const PokemonContainer = () => {
  return (
    <Query query={POKEMON_LIST}>
      {({ loading, error, data }) => {
        if (loading) return <div>Fetching</div>;
        if (error) return <div>Error</div>;

        const pokemonToRender = data.allPokemon;

        return (
          <table>
            {pokemonToRender.map((pokemon: IPokemon) => (
              <tr key={pokemon.id}>
                <a href={`/pokemon/${pokemon.pokemonNumber}`}>
                  <img src={pokemon.imageUrl} /> {pokemon.name}
                </a>
              </tr>
            ))}
          </table>
        );
      }}
    </Query>
  );
};
