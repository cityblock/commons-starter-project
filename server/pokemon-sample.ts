import { allPokemon } from './pokemon-mocks';

export default (start: number, end: number): any[] => {
  return allPokemon.slice(start, end);
};
