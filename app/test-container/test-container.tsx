import { ApolloError } from 'apollo-client';
import { getOnePokemon_singlePokemon } from 'app/graphql/types';
import React from 'react';
import { graphql } from 'react-apollo';
import getOnePokemon from '../graphql/queries/get-one-pokemon.graphql';

interface IGraphqlProps {
  singlePokemon: getOnePokemon_singlePokemon;
  loading: boolean;
  error: ApolloError | null | undefined;
}

export const TestContainer: React.StatelessComponent<IGraphqlProps> = (props: IGraphqlProps) => {
  const { singlePokemon, loading, error } = props;
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
          <h1>Bro, it's {singlePokemon.name}</h1>
          <h2>He's of type {singlePokemon.pokeType}</h2>
          <p>
            ...and his attack is {singlePokemon.attack} & defense is {singlePokemon.defense}
          </p>
        </table>
      )}
    </>
  );
};

export default graphql(getOnePokemon, {
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    singlePokemon: data ? (data as any).singlePokemon : null,
  }),
})(TestContainer);
