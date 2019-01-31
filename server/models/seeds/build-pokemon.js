const uuid = require('uuid');

module.exports = (name, pokemonNumber, attack, defense, pokeType, moves, imageUrl) => ({
  id: uuid.v4(),
  name,
  pokemonNumber,
  attack,
  defense,
  pokeType,
  moves: JSON.stringify(moves),
  imageUrl,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
