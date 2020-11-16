// Transactions were annoying so I ignored them
// And not sure why others pulled IRootMutationTypes through from schema.. that was confusing too


import Pokemon, { IPokemonInput } from '../models/pokemon';

export async function resolverGetAllPokemon() {
    return Pokemon.getAll();
}

export async function resolverGetOnePokemon({}, args: { id: string }) {
    return Pokemon.get(args.id);
}

export async function resolverCreatePokemon({}, input: IPokemonInput ){
    return Pokemon.create(input);
}

export async function resolverEditPokemon({}, args: { id: string, input: IPokemonInput} ){
  return Pokemon.edit(args.id, args.input);
}

export async function resolverDeletePokemon({}, args: { id: string} ){
  return Pokemon.delete(args.id);
}