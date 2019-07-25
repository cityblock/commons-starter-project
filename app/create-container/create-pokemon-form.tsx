import { ApolloError } from 'apollo-client';
import { pokemonCreate_createPokemon } from 'app/graphql/types';
import React, { useState } from 'react';
import { graphql } from 'react-apollo';
import pokemonCreate from '../graphql/queries/create-pokemon-mutation.graphql';
import { pokeType } from './form-logic';

enum PokeType {
  bug = 'bug',
  dark = 'dark',
  dragon = 'dragon',
  electric = 'electric',
  fairy = 'fairy',
  fighting = 'fighting',
  fire = 'fire',
  flying = 'flying',
  ghost = 'ghost',
  grass = 'grass',
  ground = 'ground',
  ice = 'ice',
  normal = 'normal',
  poison = 'poison',
  psychic = 'psychic',
  rock = 'rock',
  steel = 'steel',
  water = 'water',
}

interface IPokemon {
  id: string;
  name: string;
  pokemonNumber: number;
  pokeType: PokeType;
  attack: number;
  defense: number;
  moves: string[];
  imageUrl: string;
}

interface IGraphqlProps {
  createPokemonMutation: (options: {
    variables: pokemonCreate_createPokemon;
  }) => { data: pokemonCreate_createPokemon; errors: ApolloError[] };
}

const initialPokemon: IPokemon = {
  id: '',
  name: '',
  pokemonNumber: 13,
  pokeType: PokeType.grass,
  attack: 100,
  defense: 100,
  moves: ['Cha Cha'],
  imageUrl: 'cityblo.ck',
};

export const CreatePokemonForm: React.FC = (props: any) => {
  const { createPokemonMutation } = props;
  const [pokemon, setPokemon] = useState<IPokemon>(initialPokemon);
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const fieldToChange = e.target.name;
    const valueToSet = e.target.value;
    const newPokemon = { ...pokemon, [fieldToChange]: valueToSet };
    setPokemon(newPokemon);
  };
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await createPokemonMutation({ variables: pokemon });
      console.log('mutation went through');
      console.log('result\n', result);
    } catch (err) {
      console.log('Error:', err.message);
    }
  };
  return (
    <>
      <form
        onSubmit={e => {
          submit(e);
        }}
      >
        <h1>Create a pokemon</h1>
        <br />
        <label>ID:</label>
        <input type="text" name="id" value={pokemon.id} onChange={onChange} />
        <label>Name:</label>
        <input type="text" name="name" value={pokemon.name} onChange={onChange} />
        <br />
        <label>Pokemon Number:</label>
        <input
          type="text"
          name="pokemonNumber"
          value={Number(pokemon.pokemonNumber)}
          onChange={onChange}
        />
        <br />
        <label>Pokemon Type:</label>
        <select name="pokeType" value={PokeType.grass} onChange={onChange}>
          {pokeType.map(type => {
            return <option key={type}>{type}</option>;
          })}
        </select>
        <br />
        <label>Attack:</label>
        <input type="text" name="attack" value={Number(pokemon.attack)} onChange={onChange} />
        <br />
        <label>Defense:</label>
        <input type="text" name="defense" value={Number(pokemon.defense)} onChange={onChange} />
        <br />
        <label>Moves:</label>
        <textarea rows={4} cols={50} name="moves" value={pokemon.moves} onChange={onChange} />
        <br />
        <label>Image URL:</label>
        <input type="text" name="imageUrl" value={pokemon.imageUrl} onChange={onChange} />
        <br />
        <input type="submit" value="Pib" />
      </form>
    </>
  );
};

export default graphql(pokemonCreate, {
  name: 'createPokemonMutation',
  // options: (props: pokemonCreate_createPokemon) => {
  //   return {
  //     variables: {
  //       id: '',
  //       name: '',
  //       pokemonNumber: 0,
  //       pokeType: 'grass',
  //       attack: 100,
  //       defense: 100,
  //       moves: ['Cha Cha'],
  //       imageUrl: 'cityblo.ck',
  //     },
  //   };
  // },
})(CreatePokemonForm);
