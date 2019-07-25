import { ApolloError } from 'apollo-client';
import { pokemonCreate_createPokemon } from 'app/graphql/types';
import React, { useEffect, useState } from 'react';
import { graphql } from 'react-apollo';
import pokemonCreate from '../graphql/queries/create-pokemon-mutation.graphql';
import { pokeType } from './form-logic';

interface IRouteProps {
  match: { params: { pokemonId: string } };
}

interface IGraphqlProps {
  createPokemon: pokemonCreate_createPokemon;
  loading: boolean;
  error: ApolloError | null | undefined;
}

const initialPokemon = {
  id: '',
  name: '',
  pokemonNumber: 0,
  pokeType: 'grass',
  attack: 100,
  defense: 100,
  moves: ['Cha Cha'],
  imageUrl: 'cityblo.ck',
};

export const CreatePokemonForm: React.StatelessComponent<IGraphqlProps> = (
  props: IGraphqlProps,
) => {
  const { createPokemon, loading, error } = props;
  const [pokemon, setPokemon] = useState(initialPokemon);
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
        <form
          onSubmit={e => {
            e.preventDefault();
            console.log('pib');
          }}
        >
          <h1>Create a pokemon</h1>
          <br />
          <label>Name:</label>
          <input type="text" name="name" value={pokemon.name} />
          <br />
          <label>Pokemon Number:</label>
          <input type="text" name="pokemonNumber" value={pokemon.pokemonNumber} />
          <br />
          <label>Pokemon Type:</label>
          <select name="pokeType" value={pokemon.pokeType}>
            {pokeType.map(type => {
              return <option key={type}>{type}</option>;
            })}
          </select>
          <br />
          <label>Attack:</label>
          <input type="text" name="attack" value={pokemon.attack} />
          <br />
          <label>Defense:</label>
          <input type="text" name="defense" value={pokemon.defense} />
          <br />
          <label>Moves:</label>
          <textarea rows={4} cols={50} name="moves" value={pokemon.moves} />
          <br />
          <label>Image URL:</label>
          <input type="text" name="imageUrl" value={pokemon.imageUrl} />
          <br />
          <input type="submit" value="Pib" />
        </form>
      )}
    </>
  );
};

export default graphql(pokemonCreate, {
  options: (props: pokemonCreate_createPokemon) => {
    return {
      variables: {
        id: '',
        name: '',
        pokemonNumber: 0,
        pokeType: 'grass',
        attack: 100,
        defense: 100,
        moves: ['Cha Cha'],
        imageUrl: 'cityblo.ck',
      },
    };
  },
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    createPokemon: data ? (data as any).createPokemon : null,
  }),
})(CreatePokemonForm);
