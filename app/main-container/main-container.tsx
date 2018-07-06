import React from 'react';
import { graphql } from 'react-apollo';
import puppiesGraphql from '../graphql/queries/get-puppies.graphql';
import { getPuppies } from '../graphql/types';
import styles from './css/main.css';
import { ApolloError } from 'apollo-client';

interface IGraphqlProps {
  puppies: getPuppies['puppies'];
  loading: boolean;
  error?: ApolloError | null;
}

export const MainContainer: React.StatelessComponent<IGraphqlProps> = (props: IGraphqlProps) => {
  const { puppies, loading, error } = props;

  if (loading || error) {
    return <h1>Loading...</h1>;
  }

  const renderedPuppies = puppies.map(puppy => {
    return <p key={puppy.id}>{puppy.name}</p>;
  });

  return <div className={styles.body}>{renderedPuppies}</div>;
};

export default graphql(puppiesGraphql, {
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    puppies: data ? (data as any).puppies : null,
  }),
})(MainContainer);
