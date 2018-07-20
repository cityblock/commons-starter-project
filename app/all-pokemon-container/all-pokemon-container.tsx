import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
// GraphQL query
import allPokemonGraphql from '../graphql/queries/get-all-pokemon.graphql';
// frontend type
import { getAllPokemon } from '../graphql/types';

import styles from './css/main.css';

// query name is getAllPokemon
// query type is allPokemon (aka will route to resolver allPokemon method)
interface IGraphqlProps {
  allPokemon: getAllPokemon['allPokemon'];
  loading: boolean;
  error?: ApolloError | null;
}

interface IProps {
  children?: any;
}

type allProps = IGraphqlProps & IProps;

const AllPokemonContainer: React.StatelessComponent<allProps> = (props: allProps) => {
  const { allPokemon, loading, error } = props;

  if (loading || error) {
    return <h1>Loading...</h1>;
  }

  const renderedPokemon = allPokemon.map(pokemon => {
    return (
      <div key={pokemon.id}>
        <img src={pokemon.imageUrl} />
        <p>{pokemon.name}</p>
      </div>
    );
  });

  return (
    <div className={styles.body}>
      {props.children}
      {renderedPokemon}
    </div>
  );
};

export default graphql(allPokemonGraphql, {
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    allPokemon: data ? (data as any).allPokemon : null,
  }),
})(AllPokemonContainer);

// import { ApolloError } from 'apollo-client';
// import React from 'react';
// import { graphql } from 'react-apollo';
// import puppiesGraphql from '../graphql/queries/get-puppies.graphql';
// import { getPuppies } from '../graphql/types';
// import styles from './css/main.css';

// interface IGraphqlProps {
//   puppies: getPuppies['puppies'];
//   loading: boolean;
//   error?: ApolloError | null;
// }

// export const MainContainer: React.StatelessComponent<IGraphqlProps> = (props: IGraphqlProps) => {
//   const { puppies, loading, error } = props;

//   if (loading || error) {
//     return <h1>Loading...</h1>;
//   }

//   const renderedPuppies = puppies.map(puppy => {
//     return <p key={puppy.id}>{puppy.name}</p>;
//   });

//   return <div className={styles.body}>{renderedPuppies}</div>;
// };

// export default graphql(puppiesGraphql, {
//   props: ({ data }): IGraphqlProps => ({
//     loading: data ? data.loading : false,
//     error: data ? data.error : null,
//     puppies: data ? (data as any).puppies : null,
//   }),
// })(MainContainer);
