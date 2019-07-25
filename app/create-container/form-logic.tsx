import React from 'react';

export const pokeType = [
  'normal',
  'grass',
  'fire',
  'water',
  'electric',
  'psychic',
  'ghost',
  'dark',
  'fairy',
  'rock',
  'ground',
  'steel',
  'flying',
  'fighting',
  'bug',
  'ice',
  'dragon',
  'poison',
];

export const FormLogic: React.StatelessComponent = () => {
  return (
    <>
      <h1>Create a pokemon</h1>
      <br />
      <label>Name:</label>
      <input type="text" name="name" />
      <br />
      <label>Pokemon Number:</label>
      <input type="text" name="pokemonNumber" />
      <br />
      <label>Pokemon Type:</label>
      <select name="pokeType">
        {pokeType.map(type => {
          return (
            <option key={type} value={type}>
              {type}
            </option>
          );
        })}
      </select>
      <br />
      <label>Attack:</label>
      <input type="text" name="attack" />
      <br />
      <label>Defense:</label>
      <input type="text" name="defense" />
      <br />
      <label>Moves:</label>
      <textarea rows={4} cols={50} name="moves" />
      <br />
      <label>Image URL:</label>
      <input type="text" name="imageUrl" />
      <br />
      <input type="submit" value="Pib" />
    </>
  );
};
