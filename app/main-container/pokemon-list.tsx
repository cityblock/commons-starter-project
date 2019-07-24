import { ApolloError } from 'apollo-client';
import { getAllPokemon_allPokemon } from 'app/graphql/types';
import React from 'react';
import { graphql } from 'react-apollo';
import getAllPokemon from '../graphql/queries/get-all-pokemon.graphql';

interface IGraphqlProps {
  allPokemon: getAllPokemon_allPokemon[];
  loading: boolean;
  error: ApolloError | null | undefined;
}
export const PokemonContainer: React.StatelessComponent<IGraphqlProps> = (props: IGraphqlProps) => {
  const { allPokemon, loading, error } = props;
  return (
    <>
      {loading && <p>Loading up!</p>}
      {error && (
        <React.Fragment>
          <img src="../test-container/desus-mero.jpg" />
          <h1>Fix ya face, kehd</h1>
        </React.Fragment>
      )}
      {!loading && (
        <table>
          {allPokemon.map(pokemon => (
            <tr key={pokemon.id}>
              <a href={`/pokemon/${pokemon.pokemonNumber}`}>
                <img src={pokemon.imageUrl} /> {pokemon.name}
              </a>
            </tr>
          ))}
        </table>
      )}
    </>
  );
};

export default graphql(getAllPokemon, {
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    allPokemon: data ? (data as any).allPokemon : null,
  }),
})(PokemonContainer);
