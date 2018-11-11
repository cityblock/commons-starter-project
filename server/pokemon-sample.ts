import { IPokemonCreateFields } from './models/pokemon';
import { allPokemon } from './pokemon-mocks';

export default (start: number, end: number): IPokemonCreateFields[] => {
  return allPokemon.slice(start, end)
};
